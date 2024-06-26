import { connectDb } from "@/dbConfig/dbConfig";
import Employee from "@/models/employeeModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectDb();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const userId = await getDataFromToken(request);
    // console.log("Create User Id",userId);    
    const { name, email, salary, joiningDate, status } = reqBody;

    // console.log(reqBody);

    const employee = await Employee.findOne({ email });

    if (employee) {
      console.error("Employee with this email already exits")
      return NextResponse.json(
        { error: "Employee Already Exits" },
        { status: 400 }
      );
    }

    const newEmployee = new Employee({
      name,
      email,
      salary,
      joiningDate,
      status,
      userId
    });
    

    const savedEmployee = await newEmployee.save();
    // console.log(savedEmployee);

    return NextResponse.json({
        message:"Employee Added Successfully",
        success : true,
        savedEmployee
       })
    
  } catch (error:any) {
    console.error("Error adding employee:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
