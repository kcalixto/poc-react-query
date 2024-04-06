import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import './App.css'

function App() {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["todos"], // Unique key for the query (e.g. query id)
    queryFn: () =>
      fetch("https://jsonplaceholder.typicode.com/todos")
        .then((res) => res.json())
    ,
  })

  const {
    mutate,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: (newTodo) => fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      })
    }
  })

  if (error) {
    return (
      <div>
        {error.message}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div>
      {
        !isLoading && (
          <button onClick={refetch}>
            Refetch
          </button>
        )
      }
      {
        !isLoading && (
          isPending
            ?
            <div>
              Adding new todo...
            </div>
            :
            <button onClick={() => {
              mutate({
                userId: 5000,
                id: data.length + 1,
                title: "New todo",
                completed: false,
                body: "New todo body",
              })
            }}>
              Add new todo
            </button>
        )
      }
      {
        data && data.map((todo) => (
          <div key={todo.id} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #ccc",
          }}>
            <p>
              {todo.id}.
              {todo.completed ? "✅" : "❌"}
            </p>
            <p>
              {todo.title}
            </p>
          </div>
        ))
      }
    </div>
  )
}

export default App