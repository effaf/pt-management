from . import db
from datetime import datetime

class Servicer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.String(200))
    specialties = db.Column(db.String(200))
    commission_rate = db.Column(db.Float, nullable=False)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.String(200))
    treatment = db.Column(db.String(200))

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    servicer_id = db.Column(db.Integer, db.ForeignKey('servicer.id'), nullable=False)
    service_type = db.Column(db.String(100), nullable=False)
    duration = db.Column(db.Integer)  # in minutes
    fee = db.Column(db.Float, nullable=False)
    commission = db.Column(db.Float, nullable=False)
    notes = db.Column(db.Text)

    client = db.relationship('Client', backref=db.backref('services', lazy=True))
    servicer = db.relationship('Servicer', backref=db.backref('services', lazy=True))