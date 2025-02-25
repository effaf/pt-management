from .models import Servicer

def calculate_commission(fee, servicer_id):
    servicer = Servicer.query.get(servicer_id)
    if servicer:
        return fee * servicer.commission_rate
    return 0