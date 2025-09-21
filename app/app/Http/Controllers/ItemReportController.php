<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemReportHandlerRequest;
use App\Http\Requests\ItemReportRequest;
use App\Mail\ItemReported;
use App\Models\Item;
use App\Models\ItemReport;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;

class ItemReportController extends Controller
{
    /**
     * The report item page (GET)
     */
    public function report(ItemReportRequest $request, Item $item)
    {
        $user = $request->user();
        $itemReport = ItemReport::whereRelation('item', 'id', $item->id)
            ->whereRelation('user', 'id', $user->id)
            ->first();

        return view(
            'pages.report-item.report-item',
            ['item' => $item, 'itemReport' => $itemReport],
        );
    }

    public function reportForm(Item $item)
    {
        return view('pages.report-item.form', ['item' => $item]);
    }

    /**
     * Report another user (POST)
     */
    public function reportHandler(ItemReportHandlerRequest $request, Item $item)
    {
        $validated = $request->safe(['reason']);
        $reason = $validated['reason'];
        $user = $request->user();

        $itemReport = new ItemReport(['reason' => $reason]);
        $itemReport->item()->associate($item);
        $itemReport->user()->associate($user);
        $itemReport->save();

        Mail::to(config('mail.report_to'))->locale('en')->send(new ItemReported($itemReport));

        return response(
            null,
            Response::HTTP_NO_CONTENT,
            ['Hx-Redirect' => route('item', $item)],
        );
    }
}
