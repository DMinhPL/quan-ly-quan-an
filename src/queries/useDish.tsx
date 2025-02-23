import dishApiRequest from "@/apiRequests/dish";
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDishes = () => {
    return useQuery({
        queryKey: ['dishes'],
        queryFn: dishApiRequest.list,
    });
}

export const useUpdateDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) => dishApiRequest.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes'],
                exact: true
            })
        }
    })
}

export const useGetDetailDishQuery = ({ id, enabled }: { id: number; enabled?: boolean }) => {
    return useQuery({
        queryKey: ['dishes', id],
        queryFn: () => dishApiRequest.getDishDetail(id),
        enabled
    })
}

export const useAddDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishApiRequest.add,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes'],
            })
        }
    })
}

export const useDeleteDishMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: dishApiRequest.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['dishes'],
            })
        }
    })
}