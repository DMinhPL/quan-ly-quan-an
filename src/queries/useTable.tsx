import tableApiRequest from "@/apiRequests/table"
import { UpdateTableBodyType } from "@/schemaValidations/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useTables = () => {
    return useQuery({
        queryKey: ['tables'],
        queryFn: tableApiRequest.list
    })
}

export const useUpdateTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) => tableApiRequest.update(id, body),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['tables'],
                exact: true
            })
        },
    })
}

export const useAddTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableApiRequest.add,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables'],
            })
        }
    })
}

export const useDeleteTableMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: tableApiRequest.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tables'],
            })
        }
    })
}