import asyncpg
from app.schemas.assessment import AssessmentSubmit
from app.services.calculation import RiskCalculationService

class AssessmentRepository:
    @staticmethod
    async def calculate(pool: asyncpg.Pool, user_id: int, data: AssessmentSubmit):
        async with pool.acquire() as conn:
            async with conn.transaction():
                # 1. Ambil bobot & nama risiko dari DB sesuai Unit Type (LPEI/UUS)
                # mapping: risk_id -> {weight, name}
                if data.unit_type == "UUS":
                    rows = await conn.fetch("SELECT id, name, weight_uus as weight FROM risk_types WHERE is_uus = TRUE")
                else:
                    rows = await conn.fetch("SELECT id, name, weight_lpei as weight FROM risk_types WHERE is_lpei = TRUE")

                risk_map = {r['id']: {'w': float(r['weight']), 'name': r['name']} for r in rows}

                # 2. Calculating
                total_composite = 0
                result_details = []
                response_table = []

                for item in data.details:
                    if item.risk_type_id not in risk_map:
                        continue

                    risk_info = risk_map[item.risk_type_id]
                    weight = risk_info['w']

                    calc = RiskCalculationService.calculate_row(
                        inherent_origin=item.inherent,
                        kpmr=item.kpmr,
                        weight=weight
                    )

                    total_composite += calc['composite']

                    # Siapkan data insert DB
                    result_details.append((
                        item.risk_type_id,
                        item.inherent,
                        calc['inherent_round'],
                        item.kpmr,
                        calc['risk_rating'],
                        calc['composite']
                    ))

                    # Siapkan data JSON response
                    response_table.append({
                        "risk_name": risk_info['name'],
                        "weight_percent": f"{weight*100:.2f}%",
                        "inherent_origin": item.inherent,
                        "inherent_round": calc['inherent_round'],
                        "kpmr": item.kpmr,
                        "risk_rating": calc['risk_rating'],
                        "composite": round(calc['composite'], 2)
                    })

                # 3. Simpan header + detail ke DB
                final_label = RiskCalculationService.get_final_label(total_composite)

                await conn.execute(
                    "DELETE FROM assessments WHERE user_id=$1 AND period_id=$2 AND unit_type=$3",
                    user_id, data.period_id, data.unit_type
                )

                header_id = await conn.fetchval("""
                        INSERT INTO assessments (user_id, period_id, unit_type, total_composite_score, final_rating_label, status)
                        VALUES ($1, $2, $3, $4, $5, 'SUBMITTED')
                        RETURNING id
                    """,
                    user_id, data.period_id, data.unit_type,
                    round(total_composite, 2), final_label
                )

                # 4. Simpan Details
                await conn.executemany("""
                    INSERT INTO assessment_details 
                    (assessment_id, risk_type_id, inherent_original, inherent_rounded, kpmr_score, risk_rating, composite_score)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                """, [(header_id, *detail) for detail in result_details])

                # 5. Return response
                return {
                    "id": header_id,
                    "final_score": round(total_composite, 2),
                    "final_rating": final_label,
                    "table_data": response_table
                }