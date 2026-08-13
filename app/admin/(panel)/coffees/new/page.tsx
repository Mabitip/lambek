import { requirePermission } from "@/lib/auth/session";
import { coffeeService } from "@/lib/services/coffee.service";
import { CoffeeForm } from "@/components/admin/CoffeeForm";
import { createCoffeeAction } from "@/lib/actions/coffee.actions";

export default async function NewCoffeePage() {
  await requirePermission("MANAGE_COFFEE");
  const options = await coffeeService.getFilterOptions().catch(() => ({
    origins: [],
    processes: [],
    varieties: [],
  }));

  return (
    <div>
      <h1 className="font-serif text-3xl text-primary">New Coffee</h1>
      <div className="mt-8">
        <CoffeeForm
          origins={options.origins}
          processes={options.processes}
          varieties={options.varieties}
          action={createCoffeeAction}
        />
      </div>
    </div>
  );
}
