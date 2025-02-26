from flask import Blueprint, request, jsonify
from .models import db, Servicer, Client, Service
from .utils import calculate_commission

api = Blueprint('api', __name__)

@api.route('/servicers', methods=['GET', 'POST'])
def servicers():
    if request.method == 'POST':
        data = request.json
        new_servicer = Servicer(
            name=data['name'],
            contact_info=data['contact_info'],
            specialties=data['specialties'],
            commission_rate=data['commission_rate']
        )
        db.session.add(new_servicer)
        db.session.commit()
        return jsonify({"message": "Servicer created successfully"}), 201
    else:
        servicers = Servicer.query.all()
        return jsonify([{
            "id": s.id,
            "name": s.name,
            "contact_info": s.contact_info,
            "specialties": s.specialties,
            "commission_rate": s.commission_rate
        } for s in servicers])

@api.route('/clients', methods=['GET', 'POST'])
def clients():
    if request.method == 'POST':
        data = request.json
        new_client = Client(
            name=data['name'],
            contact_info=data['contact_info'],
            treatment=data['treatment']
        )
        db.session.add(new_client)
        db.session.commit()
        return jsonify({"message": "Client created successfully"}), 201
    else:
        clients = Client.query.all()
        return jsonify([{
            "id": c.id,
            "name": c.name,
            "contact_info": c.contact_info,
            "treatment": c.treatment
        } for c in clients])

@api.route('/services', methods=['GET', 'POST'])
def services():
    if request.method == 'POST':
        data = request.json
        commission = calculate_commission(data['fee'], data['servicer_id'])
        new_service = Service(
            client_id=data['client_id'],
            servicer_id=data['servicer_id'],
            type=data['type'],
            duration=data['duration'],
            fee=data['fee'],
            commission=commission,
            notes=data.get('notes', '')
        )
        db.session.add(new_service)
        db.session.commit()
        return jsonify({"message": "Service created successfully"}), 201
    else:
        services = Service.query.all()
        return jsonify([{
            "id": s.id,
            "date": s.date,
            "client_id": s.client_id,
            "servicer_id": s.servicer_id,
            "type": s.type,
            "duration": s.duration,
            "fee": s.fee,
            "commission": s.commission,
            "notes": s.notes
        } for s in services])

@api.route('/commissions', methods=['GET'])
def commissions():
    servicer_id = request.args.get('servicer_id')
    if servicer_id:
        services = Service.query.filter_by(servicer_id=servicer_id).all()
    else:
        services = Service.query.all()
    
    commissions = {}
    for service in services:
        if service.servicer_id not in commissions:
            commissions[service.servicer_id] = 0
        commissions[service.servicer_id] += service.commission
    
    return jsonify(commissions)