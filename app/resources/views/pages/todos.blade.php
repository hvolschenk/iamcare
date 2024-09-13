<x-base>
    <x-slot:title>
        Todos
    </x-slot>

    @include('components.todos', ['todos' => $todos])

    <hr />

    <form
        hx-post="/todos"
        hx-reset-after-submit
        hx-swap="outerHTML"
        hx-target="#todos"
    >
        @csrf
        <label for="title">Title</label>
        <input id="title" name="title" type="text" />
        <label for="description">Description</label>
        <input id="description" name="description" type="text" />
        <button type="submit">Submit</button>
    </form>
</x-base>
