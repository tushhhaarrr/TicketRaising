from app.db.session import SessionLocal
from app.models.user import User
from app.core import security

def create_test_user():
    db = SessionLocal()
    email = "user@example.com"
    password = "user123"
    
    try:
        # Check if exists
        user = db.query(User).filter(User.email == email).first()
        
        if user:
            print(f"User found: {user.email}")
            # Reset password just in case
            user.hashed_password = security.get_password_hash(password)
            user.is_active = True
            print("Password reset to 'user123' and account activated.")
        else:
            print(f"User not found. Creating {email}...")
            user = User(
                email=email,
                hashed_password=security.get_password_hash(password),
                full_name="Test User",
                is_active=True
            )
            db.add(user)
            print("User created.")
            
        db.commit()
        print("Done.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
