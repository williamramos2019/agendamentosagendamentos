import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentRepository } from "@/repositories/AppointmentRepository";
import { Appointment } from "@/core/types";
import { toast } from "sonner";
import { useCallback } from "react";

export function useAppointments() {
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentRepository.getAll(),
  });

  const addAppointmentMutation = useMutation({
    mutationFn: (appointment: Omit<Appointment, "id">) => appointmentRepository.create(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento realizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao realizar agendamento");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment["status"] }) =>
      appointmentRepository.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Status atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  const getAppointmentsByDate = useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  }, [appointments]);

  return {
    appointments,
    isLoading,
    addAppointment: addAppointmentMutation.mutateAsync,
    updateAppointmentStatus: (id: string, status: Appointment["status"]) => 
      updateStatusMutation.mutate({ id, status }),
    getAppointmentsByDate,
  };
}
