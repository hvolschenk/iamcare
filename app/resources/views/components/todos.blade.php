<div id="todos">
    @if (count($todos) > 0)
        <ul>
            @foreach ($todos as $todo)
                <li>{{ $todo->title }}</li>
            @endforeach
        </ul>
    @else
        <article>
            <aside>
                <p>No Todos. Create one?</p>
            </aside>
        </article>
    @endif
</div>
