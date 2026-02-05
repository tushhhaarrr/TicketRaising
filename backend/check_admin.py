from app.db.session import SessionLocal
from app.models.user import Admin
from app.core.config import settings

def check_admin():
    db = SessionLocal()
    email = settings.FIRST_SUPERUSER
    print(f"Checking for admin: {email}")
    
    admin = db.query(Admin).filter(Admin.email == email).first()
    
    if admin:
        print("[FOUND] Admin FOUND in database.")
        print(f"   ID: {admin.id}")
        print(f"   Role: {admin.role}")
        print(f"   Is Active: {admin.is_active}")
        print(f"   Password Hash starts with: {admin.hashed_password[:10]}...")
    else:
        print("[NOT FOUND] Admin NOT FOUND in database.")

    db.close()

if __name__ == "__main__":
    check_admin()
