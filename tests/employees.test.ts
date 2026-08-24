import { expect, test } from '../fixtures';
import { buildDepartment, buildEmployee, randomEmployeeStatus } from '../helpers/testData';
import {
  createDepartmentViaApi,
  createEmployeeViaApi,
  departmentsApiPath,
  employeesApiPath,
} from '../helpers/api';
import { createViaUi, deleteViaUi, editViaUi } from './crud-helpers';

test.describe('Employees CRUD', () => {
  test('creates a new employee', async ({ employeesPage, trackForCleanup, request }) => {
    const department = buildDepartment();
    const createdDepartment = await createDepartmentViaApi(request, {
      name: department.name,
      description: department.description,
    });
    trackForCleanup(departmentsApiPath, createdDepartment.id);

    const employee = buildEmployee({ departmentLabel: department.name });

    const created = await createViaUi(employeesPage, {
      entityLabel: 'employees',
      data: employee,
      createdName: employee.name,
      rowData: {
        email: employee.email,
        departmentLabel: employee.departmentLabel,
        position: employee.position,
        salary: employee.salary,
        status: employee.status,
      },
      toast: 'Employee created successfully',
      track: (id) => trackForCleanup(employeesApiPath, id),
    });

    expect(created.name).toBe(employee.name);
    expect(created.email).toBe(employee.email);
    expect(created.departmentId).toBe(createdDepartment.id);
    expect(created.position).toBe(employee.position);
    expect(created.salary).toBe(employee.salary);
    expect(created.hireDate).toBe(employee.hireDate);
    expect(created.status).toBe(employee.status);
  });

  test('edits an existing employee', async ({ employeesPage, trackForCleanup, request }) => {
    const originalDepartment = buildDepartment();
    const createdOriginalDepartment = await createDepartmentViaApi(request, {
      name: originalDepartment.name,
      description: originalDepartment.description,
    });
    trackForCleanup(departmentsApiPath, createdOriginalDepartment.id);

    const updatedDepartment = buildDepartment();
    const createdUpdatedDepartment = await createDepartmentViaApi(request, {
      name: updatedDepartment.name,
      description: updatedDepartment.description,
    });
    trackForCleanup(departmentsApiPath, createdUpdatedDepartment.id);

    const original = buildEmployee({ departmentLabel: originalDepartment.name });
    const createdOriginal = await createEmployeeViaApi(request, {
      name: original.name,
      email: original.email,
      departmentId: createdOriginalDepartment.id,
      position: original.position,
      salary: original.salary,
      hireDate: original.hireDate,
      status: original.status,
    });
    trackForCleanup(employeesApiPath, createdOriginal.id);

    const updated = buildEmployee({
      name: `Edit ${original.name}`,
      email: `edited+${original.email}`,
      departmentLabel: updatedDepartment.name,
      position: `Senior ${original.position}`,
      salary: original.salary + 5000,
      hireDate: '2023-04-15',
      status: randomEmployeeStatus(original.status),
    });

    const apiResult = await editViaUi(employeesPage, {
      entityLabel: 'employees',
      originalName: original.name,
      originalRowData: {
        email: original.email,
        departmentLabel: original.departmentLabel,
        position: original.position,
        salary: original.salary,
        status: original.status,
      },
      updated,
      updatedName: updated.name,
      updatedRowData: {
        email: updated.email,
        departmentLabel: updated.departmentLabel,
        position: updated.position,
        salary: updated.salary,
        status: updated.status,
      },
      toast: 'Employee updated successfully',
    });

    expect(apiResult.name).toBe(updated.name);
    expect(apiResult.email).toBe(updated.email);
    expect(apiResult.departmentId).toBe(createdUpdatedDepartment.id);
    expect(apiResult.position).toBe(updated.position);
    expect(apiResult.salary).toBe(updated.salary);
    expect(apiResult.hireDate).toBe(updated.hireDate);
    expect(apiResult.status).toBe(updated.status);
  });

  test('deletes an existing employee', async ({ employeesPage, trackForCleanup, request }) => {
    const department = buildDepartment();
    const createdDepartment = await createDepartmentViaApi(request, {
      name: department.name,
      description: department.description,
    });
    trackForCleanup(departmentsApiPath, createdDepartment.id);

    const employee = buildEmployee({ departmentLabel: department.name });
    await createEmployeeViaApi(request, {
      name: employee.name,
      email: employee.email,
      departmentId: createdDepartment.id,
      position: employee.position,
      salary: employee.salary,
      hireDate: employee.hireDate,
      status: employee.status,
    });

    // The delete flow is the test, so the employee is intentionally not tracked
    // for cleanup — the UI deletes it below.
    await deleteViaUi(employeesPage, {
      entityLabel: 'employees',
      name: employee.name,
      rowData: {
        email: employee.email,
        departmentLabel: employee.departmentLabel,
        position: employee.position,
        salary: employee.salary,
        status: employee.status,
      },
      toast: 'Employee deleted successfully',
    });

    const remaining = await request.get(employeesApiPath);
    expect(remaining.ok()).toBeTruthy();
    expect(await remaining.json()).not.toContainEqual(expect.objectContaining({ email: employee.email }));
  });
});
