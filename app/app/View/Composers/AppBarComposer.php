<?php

namespace App\View\Composers;

use App\Models\Thread;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AppBarComposer
{
    /**
     * @var Request
     */
    private $request;

    /**
     * Create a new profile composer.
     */
    public function __construct(Request $request) {
        $this->request = $request;
    }

    /**
     * Bind data to the view.
     */
    public function compose(View $view): void
    {
        $user = $this->request->user();
        if ($user) {
            $unreadThreadCount = Thread::distinct('threads.id')
                ->join('messages', 'threads.id', '=', 'messages.thread_id')
                ->where(function (Builder $query) use ($user) {
                    $query
                        ->where('user_id_giver', $user->id)
                        ->orWhere('user_id_receiver', $user->id);
                })
                ->where('messages.user_id', '<>', $user->id)
                ->where('messages.is_read', false)
                ->count('threads.id');
        } else {
            $unreadThreadCount = 0;
        }

        $view->with('unreadThreadCount', $unreadThreadCount);
    }
}
