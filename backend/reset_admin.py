from app.db.session import SessionLocal  # Hum database session import kar rahe hain taaki DB operations perform kar sakein. Direct connection inefficient hota hai isliye session pool use kiya.
from app.models.user import Admin  # Admin model import kiya taaki Admin table pe query ya insert kar sakein. Raw SQL queries likhne se better hai ORM use karna for safety and readability.
from app.core import security  # Security module import kiya password hashing maintain karne ke liye. Plain text password store karna secure nahi hota.
from app.models.enums import AdminRole  # AdminRole enum use kar rahe hain taaki role values consistent rahein (jaise 'SENIOR'). Hardcoded strings use karne se typo errors ho sakte hain.

def reset_super_admin():  # Ye function super admin create ya reset karne ke liye hai. Script ko function mein encapsulate karna better hai taaki ise reuse kiya ja sake.
    db = SessionLocal()  # Database session start kar rahe hain. Har request ke liye naya session banana best practice hai concurrency handle karne ke liye.
    email = "admin@example.com"  # Default admin email set kiya hai. Ise hardcode kiya hai kyunki ye ek reset script hai, production mein env variables use karte hain over hardcoding.
    password = "admin123"  # Default password set kiya process simplify karne ke liye during dev/reset. Production mein strong passwords enforce karne chahiye.
    
    try:  # Try block use kar rahe hain taaki potential errors (DB connection issue etc.) ko gracefully handle kar sakein bina crash kiye.
        # Check if exists
        # Admin table mein query kar rahe hain email ke basis pe. `first()` use kiya kyunki humein sirf ek unique user chahiye. `all()` use karte toh list milti jo unnecessary memory leti.
        admin = db.query(Admin).filter(Admin.email == email).first()
        
        if admin:  # Agar admin pehle se exist karta hai toh hum usse update karenge. Duplicate entries create hone se rokne ke liye ye check zaroori hai.
            print(f"Admin found: {admin.email}")  # Console pe status print kar rahe hain debugging ke liye.
            # Reset password just in case
            # Password ko hash kar rahe hain security ke liye. Plain text password database mein kabhi store nahi karna chahiye kyunki data leaks mein wo compromise ho jayenge.
            admin.hashed_password = security.get_password_hash(password)
            admin.role = AdminRole.SENIOR  # Role ko wapas SENIOR pe set kar rahe hain ensure karne ke liye ki permissions sahi hain.
            admin.is_active = True  # Account ko active mark kar rahe hain agar wo disabled tha.
            print("Password reset to 'admin123' and account activated.")  # User ko update confirm kar rahe hain.
        else:  # Agar admin nahi mila toh naya create karenge.
            print(f"Admin not found. Creating {email}...")  # Creation process start hone ka indication.
            admin = Admin(  # Naya Admin object instantiate kar rahe hain. ORM use karke object banana SQL insert se zyada easy aur error-proof hai.
                email=email,  # Email assign kiya.
                hashed_password=security.get_password_hash(password),  # Password hash karke store kiya. Direct password assign karna dangerous hai.
                full_name="Super Admin",  # Default name assign kiya.
                role=AdminRole.SENIOR,  # Highest privilege role assign kiya.
                is_active=True  # Account active set kiya taaki turant login kar sakein.
            )
            db.add(admin)  # Naye admin object ko session mein add kiya. Ye abhi DB mein save nahi hua, sirf track ho raha hai.
            print("Admin created.")  # Confirmation message.
            
        db.commit()  # Transaction commit kar rahe hain taaki changes permanent ho jayein. Bina commit ke data save nahi hoga.
        print("Done.")  # Final success message.
    except Exception as e:  # Koi bhi error aane pe pakad rahe hain. Generic Exception catch karna yahan theek hai kyunki ye script hai, main app mein specific exceptions catch karte hain.
        print(f"Error: {e}")  # Error detail print kar rahe hain debugging ke liye.
        db.rollback()  # Error aane pe transaction rollback kar rahe hain taaki partial/corrupt data save na ho pure database consistency ke liye.
    finally:  # Finally block hamesha chalega chahe error aaye ya nahi.
        db.close()  # Session close karna zaroori hai connection pool resources free karne ke liye. Agar close nahi karenge toh connection limit exceed ho sakti hai.

if __name__ == "__main__":  # Ye check karta hai ki script direct run ho rahi hai ya import. Direct run pe hi function call hoga, import hone pe nahi (modularity ke liye).
    reset_super_admin()  # Main function call kiya.
