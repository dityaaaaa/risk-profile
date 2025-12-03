import math

class RiskCalculationService:
    # 1. MATRIKS RISIKO (Inheren Pembulatan vs KPMR -> Peringkat Risiko)
    RISK_MATRIX = {
        1: {1: 1, 2: 1, 3: 2, 4: 2, 5: 3},
        2: {1: 1, 2: 2, 3: 2, 4: 3, 5: 3},
        3: {1: 2, 2: 2, 3: 3, 4: 3, 5: 4},
        4: {1: 2, 2: 3, 3: 3, 4: 4, 5: 5},
        5: {1: 3, 2: 4, 3: 4, 4: 5, 5: 5},
    }

    # 2. RANGE PENENTUAN PERINGKAT (Total Composite -> Label)
    @staticmethod
    def get_final_label(score: float) -> str:
        if score <= 1.8: return "Rendah (1)"
        if score <= 2.6: return "Sedang Rendah (2)"
        if score <= 3.4: return "Sedang (3)"
        if score <= 4.2: return "Sedang Tinggi (4)"
        return "Tinggi (5)"
    
    @staticmethod
    def calculate_row(inherent_origin: float, kpmr: int, weight: float):
        """
        Input: Angka Inheren (2.32), KPMR (3), Bobot (0.30)
        Output: Semua angka untuk baris tabel
        """
        # A. Pembulatan (round-up)
        inherent_rounded = math.floor(inherent_origin + 0.5)
        inherent_rounded = max(1, min(5, inherent_rounded))

        # B. Lookup Matriks (Cari peringkat risiko)
        risk_rating = RiskCalculationService.RISK_MATRIX.get(inherent_rounded, {}).get(kpmr, 3)

        # C. Complete...
        composite = risk_rating * weight

        return {
            "inherent_round": inherent_rounded,
            "risk_rating": risk_rating,
            "composite": composite
        }

