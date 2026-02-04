from logging.config import fileConfig  # Logging configure karne ke liye helper.
import sys  # System specific parameters access karne ke liye.
import os  # OS level operations (getcwd etc).

# Ensure app is importable
# Current directory path mein add kar rahe hain taaki 'app' module import ho sake.
sys.path.append(os.getcwd())

from sqlalchemy import engine_from_config  # Config dictionary se engine banane ke liye.
from sqlalchemy import pool  # Connection pooling ke liye.

from alembic import context  # Alembic ka context object jo migration state hold karta hai.

# Import Base and Settings
from app.db.session import Base  # Humare models ka base class. Iski metadata property zaroori hai.
from app.core.config import settings  # Settings (DB URL) import kar rahe hain.
# Import all models so they register with Base.metadata
# Taaki autogenerate detect kar sake ki models mein kya change hua hai vs database.
from app.models import *

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config  # Alembic config object initialize kar rahe hain.

# Interpret the config file for Python logging.
# This line sets up loggers basically.
# Logging setup kar rahe hain agar config file present hai.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = Base.metadata  # SQLAlchemy metadata assign kar rahe hain taaki alembic tables structure compare kar sake.

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

def get_url():  # Helper function DB URL lene ke liye.
    return settings.DATABASE_URL  # .env se loaded URL return kar rahe hain. `alembic.ini` wala hardcoded URL override hoga.

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # Offline mode: Bina DB connect kiye SQL generate karne ke liye.
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,  # SQL mein values hardcode karne ke liye (safe for offline scripts).
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():  # Transaction block.
        context.run_migrations()  # Migrations execute kar rahe hain (SQL print hoga).


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Online mode: Real database se connect karke migration apply karne ke liye.
    configuration = config.get_section(config.config_ini_section)  # Config section read kar rahe hain.
    configuration["sqlalchemy.url"] = get_url()  # URL dynamic set kar rahe hain settings se.
    
    connectable = engine_from_config(  # Engine create kar rahe hain.
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,  # NullPool use kar rahe hain kyunki migration script single threaded/short lived hai.
    )

    with connectable.connect() as connection:  # DB Connection open kar rahe hain.
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():  # Transaction start. Error aane pe rollback ho jayega automatic.
            context.run_migrations()  # Migrations run kar rahe hain.


if context.is_offline_mode():  # Check kar rahe hain ki user ne --sql flag use kiya hai ya nahi.
    run_migrations_offline()
else:
    run_migrations_online()
