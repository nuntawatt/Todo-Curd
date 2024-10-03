import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";


// CRUD => CREATE UPDATE 
// READ data
// url => api/v1/todo
export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({}).select('-__v');
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}


// Create
// url => api/v1/todo/id
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newTodo = { ...body, status: false };
    const res = await Todo.create(newTodo);
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({
      error: error,
    });
  }
}


// Update
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const res = await Todo.updateOne(
      { _id: id },
      { status: status } 
    );
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Something went wrong',
    });
  }
}


// Delete
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required for deletion" });
    }

    const res = await Todo.deleteOne({ _id: id });
    if (res.deletedCount === 0) {
      return NextResponse.json({ error: "No task found with the provided ID" });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // ตรวจสอบว่า error เป็น Error หรือไม่
      return NextResponse.json({
        error: error.message || "Failed to delete task",
      });
    } else {
      return NextResponse.json({
        error: "An unknown error occurred",
      });
    }
  }
}
