import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Users,
  UserPlus,
  MessageSquare,
  Trash2,
  Check,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: string;
  name: string;
  email: string;
  title: string;
  status: "pending" | "active";
  profilePicture?: string;
  joinedDate?: string;
}

export const VCAdminOrganisation = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingEmployees, setPendingEmployees] = useState<Employee[]>([]);
  const [activeEmployees, setActiveEmployees] = useState<Employee[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    // TODO: Integrate with backend API when ready
    // For now, using placeholder data
    
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Placeholder data
    setPendingEmployees([
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        title: "Senior Analyst",
        status: "pending",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        title: "Associate",
        status: "pending",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        title: "Analyst",
        status: "pending",
      },
    ]);

    setActiveEmployees([
      {
        id: "4",
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        title: "Principal",
        status: "active",
        joinedDate: "2024-01-15",
      },
      {
        id: "5",
        name: "David Brown",
        email: "david.brown@example.com",
        title: "Senior Associate",
        status: "active",
        joinedDate: "2024-02-20",
      },
    ]);

    setLoading(false);
  };

  const handleAccept = async (employeeId: string) => {
    setProcessingId(employeeId);
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      const employee = pendingEmployees.find((e) => e.id === employeeId);
      if (employee) {
        setPendingEmployees((prev) => prev.filter((e) => e.id !== employeeId));
        setActiveEmployees((prev) => [
          ...prev,
          {
            ...employee,
            status: "active" as const,
            joinedDate: new Date().toISOString().split("T")[0],
          },
        ]);

        toast({
          title: "Employee accepted",
          description: `${employee.name} has been added to your organisation.`,
        });
      }
    } catch (error) {
      console.error("Error accepting employee:", error);
      toast({
        title: "Error",
        description: "Failed to accept employee request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (employeeId: string) => {
    setProcessingId(employeeId);
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      const employee = pendingEmployees.find((e) => e.id === employeeId);
      if (employee) {
        setPendingEmployees((prev) => prev.filter((e) => e.id !== employeeId));

        toast({
          title: "Request rejected",
          description: `${employee.name}'s request has been rejected.`,
        });
      }
    } catch (error) {
      console.error("Error rejecting employee:", error);
      toast({
        title: "Error",
        description: "Failed to reject employee request",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRemoveClick = (employeeId: string) => {
    const employee = activeEmployees.find((e) => e.id === employeeId);
    if (employee) {
      setEmployeeToRemove(employee);
      setRemoveDialogOpen(true);
    }
  };

  const handleRemoveConfirm = async () => {
    if (!employeeToRemove) return;

    setProcessingId(employeeToRemove.id);
    setRemoveDialogOpen(false);
    
    try {
      // TODO: Integrate with backend API when ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      setActiveEmployees((prev) => prev.filter((e) => e.id !== employeeToRemove.id));

      toast({
        title: "Employee removed",
        description: `${employeeToRemove.name} has been removed from your organisation.`,
      });
    } catch (error) {
      console.error("Error removing employee:", error);
      toast({
        title: "Error",
        description: "Failed to remove employee",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
      setEmployeeToRemove(null);
    }
  };

  const handleMessage = (employeeId: string) => {
    // TODO: Implement messaging functionality when ready
    const employee = [...pendingEmployees, ...activeEmployees].find(
      (e) => e.id === employeeId
    );
    toast({
      title: "Messaging",
      description: `Messaging functionality for ${employee?.name} will be implemented soon.`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Organisation</h1>
        <p className="text-white/60">
          Manage your team members and pending requests
        </p>
      </div>

      {/* Pending Requests Section */}
      {pendingEmployees.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            <h2 className="text-xl font-semibold text-white">
              Pending Requests ({pendingEmployees.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingEmployees.map((employee) => (
              <Card
                key={employee.id}
                className="bg-[#151a24] border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-white/60 truncate">
                      {employee.email}
                    </p>
                    <Badge className="mt-1 bg-amber-500/20 text-amber-400 border-amber-500/30">
                      {employee.title}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => handleAccept(employee.id)}
                    disabled={processingId === employee.id}
                  >
                    {processingId === employee.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleReject(employee.id)}
                    disabled={processingId === employee.id}
                  >
                    {processingId === employee.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                    onClick={() => handleMessage(employee.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Active Employees Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
          <h2 className="text-xl font-semibold text-white">
            Active Employees ({activeEmployees.length})
          </h2>
        </div>
        {activeEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEmployees.map((employee) => (
              <Card
                key={employee.id}
                className="bg-[#151a24] border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-white/60 truncate">
                      {employee.email}
                    </p>
                    <Badge className="mt-1 bg-green-500/20 text-green-400 border-green-500/30">
                      {employee.title}
                    </Badge>
                    {employee.joinedDate && (
                      <p className="text-xs text-white/40 mt-1">
                        Joined {new Date(employee.joinedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => handleMessage(employee.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleRemoveClick(employee.id)}
                    disabled={processingId === employee.id}
                  >
                    {processingId === employee.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-[#151a24] border-white/10 p-8 text-center">
            <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No active employees yet</p>
          </Card>
        )}
      </section>

      {/* Remove Employee Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent className="bg-[#151a24] border-white/10">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <AlertDialogTitle className="text-white">
                Remove Employee?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to remove <strong className="text-white">{employeeToRemove?.name}</strong> from your organisation? 
              This action cannot be undone. They will lose access to the platform and will need to be re-invited to join again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
            >
              Remove Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
