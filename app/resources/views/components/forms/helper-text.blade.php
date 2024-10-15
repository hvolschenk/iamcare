<p
    class="
        @error($field)
            dark:text-red-700
            text-red-600
        @else
            text-gray-400
        @enderror
        mb-4
        text-sm"
>
    @error($field)
        {{ $message }}
    @else
        {{ $helperText }}
    @enderror
</p>
