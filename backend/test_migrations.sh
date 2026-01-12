#!/bin/bash
# Migration testing script for Phase 2
# Tests upgrade and downgrade functionality

set -e

echo "=== Alembic Migration Testing ==="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Using default local database."
    export DATABASE_URL="postgresql://todo_user:todo_password@localhost:5432/todo_dev"
fi

echo "📊 Database URL: $DATABASE_URL"
echo ""

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "🐍 Activating virtual environment..."
    source venv/bin/activate
fi

# Test 1: Show current migration status
echo "=== Test 1: Current Migration Status ==="
alembic current
echo ""

# Test 2: Upgrade to head
echo "=== Test 2: Upgrade to HEAD ==="
alembic upgrade head
echo "✅ Upgrade successful"
echo ""

# Test 3: Verify tables were created
echo "=== Test 3: Verify Tables Created ==="
if command -v psql &> /dev/null; then
    psql "$DATABASE_URL" -c "\dt"
    echo ""
    psql "$DATABASE_URL" -c "\d users"
    echo ""
    psql "$DATABASE_URL" -c "\d tasks"
else
    echo "⚠️  psql not found. Skipping table verification."
    echo "   Run: docker exec -it todo_postgres_dev psql -U todo_user -d todo_dev -c '\\dt'"
fi
echo ""

# Test 4: Downgrade one step
echo "=== Test 4: Downgrade One Step ==="
alembic downgrade -1
echo "✅ Downgrade successful"
echo ""

# Test 5: Upgrade back to head
echo "=== Test 5: Re-upgrade to HEAD ==="
alembic upgrade head
echo "✅ Re-upgrade successful"
echo ""

# Test 6: Show migration history
echo "=== Test 6: Migration History ==="
alembic history
echo ""

echo "✅ All migration tests passed!"
echo ""
echo "📝 Next steps:"
echo "   1. Verify indexes: psql \$DATABASE_URL -c '\\di'"
echo "   2. Test foreign key constraint: Try to insert task with invalid user_id"
echo "   3. Continue to Phase 3: Backend Authentication"
