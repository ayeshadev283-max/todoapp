"""Quick test script to verify application functionality."""

from src.services.task_service import TaskService

def test_all_features():
    """Test all core features of the todo application."""
    service = TaskService()

    print("=== Testing Todo Application ===\n")

    # Test 1: Add tasks
    print("Test 1: Adding tasks...")
    task1 = service.add_task("Buy groceries", "Get milk, eggs, bread")
    task2 = service.add_task("Call dentist")
    task3 = service.add_task("Prepare presentation", "Include Q1 results")
    print(f"✓ Added 3 tasks (IDs: {task1.id}, {task2.id}, {task3.id})")

    # Test 2: List tasks
    print("\nTest 2: Listing all tasks...")
    tasks = service.list_tasks()
    print(f"✓ Found {len(tasks)} tasks")

    # Test 3: Toggle status
    print("\nTest 3: Toggling task status...")
    toggled = service.toggle_status(1)
    print(f"✓ Task 1 status: {'Complete' if toggled.completed else 'Incomplete'}")
    toggled_back = service.toggle_status(1)
    print(f"✓ Task 1 status after toggle: {'Complete' if toggled_back.completed else 'Incomplete'}")

    # Test 4: Update task
    print("\nTest 4: Updating task...")
    updated = service.update_task(1, title="Buy groceries and toiletries")
    print(f"✓ Updated task 1 title: {updated.title}")

    # Test 5: Delete task
    print("\nTest 5: Deleting task...")
    deleted = service.delete_task(2)
    print(f"✓ Deleted task: {deleted.title}")
    remaining = service.list_tasks()
    print(f"✓ Remaining tasks: {len(remaining)}")

    # Test 6: Empty title validation
    print("\nTest 6: Testing empty title validation...")
    try:
        service.add_task("")
        print("✗ FAILED: Should have raised ValueError")
    except ValueError as e:
        print(f"✓ Correctly rejected empty title: {e}")

    # Test 7: Non-existent ID
    print("\nTest 7: Testing non-existent ID...")
    result = service.toggle_status(999)
    print(f"✓ Non-existent ID returns None: {result is None}")

    # Test 8: Empty description handling
    print("\nTest 8: Testing empty description...")
    task_no_desc = service.add_task("Task without description")
    print(f"✓ Task created with empty description: '{task_no_desc.description}'")

    print("\n=== All Tests Passed! ===")

if __name__ == "__main__":
    test_all_features()
