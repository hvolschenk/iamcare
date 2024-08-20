import { faker } from '@faker-js/faker';
import React from 'react';
import { RouteObject, useLoaderData } from 'react-router-dom';

import markItemAsGiven from '~/src/api/items/markAsGiven';
import threadMarkAsRead from '~/src/api/threads/markAsRead';
import threadReply from '~/src/api/threads/reply';
import l10n from '~/src/l10n';
import {
  RenderResult,
  fireEvent,
  renderRouter,
  testUser,
  waitFor,
} from '~/src/testing';
import {
  message as messageMock,
  thread as threadMock,
} from '~/src/testing/mocks';
import {
  healthAndSafety as healthAndSafetyURL,
  item as itemURL,
  thread as threadURL,
} from '~/src/urls';

import { Component as Thread } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
  };
});
jest.mock('~/src/api/items/markAsGiven');
jest.mock('~/src/api/threads/get');
jest.mock('~/src/api/threads/markAsRead');
jest.mock('~/src/api/threads/reply');

const thread = threadMock({ userGiver: testUser });
const routes: RouteObject[] = [
  { Component: Thread, path: threadURL() },
  {
    element: <div data-testid="health-and-safety" />,
    path: healthAndSafetyURL(),
  },
  { element: <div data-testid="item" />, path: itemURL() },
];

describe('As a sending user', () => {
  let wrapper: RenderResult;
  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(thread);
    (threadMarkAsRead as jest.Mock)
      .mockClear()
      .mockResolvedValue({ status: 204 });
    wrapper = renderRouter(routes, [threadURL(thread.id.toString())]);
    await waitFor(() =>
      expect(wrapper.queryAllByTestId('thread__message')).toHaveLength(
        thread.messages.length,
      ),
    );
  });

  test('Renders the proper amount of messages', () => {
    expect(wrapper.queryAllByTestId('thread__message')).toHaveLength(
      thread.messages.length,
    );
  });

  describe('Sending a reply', () => {
    const reply = faker.lorem.sentences();

    beforeEach(async () => {
      fireEvent.change(wrapper.getByTestId('thread__reply--message'), {
        target: { value: reply },
      });
      await waitFor(() =>
        expect(wrapper.queryByTestId('thread__reply--message')).toHaveValue(
          reply,
        ),
      );
      await waitFor(() =>
        expect(
          wrapper.queryByTestId('thread__reply__action--primary'),
        ).not.toBeDisabled(),
      );
    });

    describe('When the API call fails', () => {
      beforeEach(async () => {
        (threadReply as jest.Mock)
          .mockClear()
          .mockRejectedValue(new Error('Failed to reply'));
        fireEvent.click(wrapper.getByTestId('thread__reply__action--primary'));
        await waitFor(() => expect(threadReply).toHaveBeenCalledTimes(1));
        await waitFor(
          () =>
            expect(wrapper.queryByTestId('notifications__notification'))
              .toBeInTheDocument,
        );
      });

      test('Shows a notification indicating that the action failed', () => {
        expect(
          wrapper.queryByTestId('notifications__notification'),
        ).toHaveTextContent(l10n.threadReplyError);
      });
    });

    describe('When the API call succeeds', () => {
      beforeAll(() => {
        const message = messageMock({ message: reply });
        thread.messages.push(message);
      });

      beforeEach(async () => {
        (threadReply as jest.Mock)
          .mockClear()
          .mockResolvedValue({ data: thread, status: 200 });
        fireEvent.click(wrapper.getByTestId('thread__reply__action--primary'));
        await waitFor(() => expect(threadReply).toHaveBeenCalledTimes(1));
        await waitFor(
          () =>
            expect(wrapper.queryByTestId('notifications__notification'))
              .toBeInTheDocument,
        );
        await waitFor(() =>
          expect(wrapper.queryAllByTestId('thread__message')).toHaveLength(
            thread.messages.length,
          ),
        );
      });

      test('Shows a notification indicating that the message has been sent', () => {
        expect(
          wrapper.queryByTestId('notifications__notification'),
        ).toHaveTextContent(l10n.threadReplySuccess);
      });

      test('Renders the new amount of messages', () => {
        expect(wrapper.queryAllByTestId('thread__message')).toHaveLength(
          thread.messages.length,
        );
      });
    });
  });

  describe('Marking the item as given', () => {
    const threadGiven = {
      ...thread,
      item: { ...thread.item, isGiven: true },
    };

    beforeEach(() => {
      (useLoaderData as jest.Mock).mockClear().mockReturnValue(threadGiven);
      fireEvent.click(wrapper.getByTestId('thread__item__mark-as-given'));
    });

    describe('When the API call fails', () => {
      beforeEach(async () => {
        (markItemAsGiven as jest.Mock)
          .mockClear()
          .mockRejectedValue(new Error('Failed to mark as given'));
        fireEvent.click(wrapper.getByTestId('item__mark-as-given'));
        await waitFor(() => expect(markItemAsGiven).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('notifications__notification'),
          ).toBeInTheDocument(),
        );
      });

      test('Shows a notification indicating that marking as given failed', () => {
        expect(
          wrapper.queryByTestId('notifications__notification'),
        ).toHaveTextContent(l10n.itemMarkAsGivenError);
      });
    });

    describe('When the API call succeeds', () => {
      beforeEach(async () => {
        (markItemAsGiven as jest.Mock).mockClear().mockResolvedValue({
          data: { ...thread.item, isGiven: true },
          status: 200,
        });
        fireEvent.click(wrapper.getByTestId('item__mark-as-given'));
        await waitFor(() => expect(markItemAsGiven).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('notifications__notification'),
          ).toBeInTheDocument(),
        );
      });

      test('Shows a notification indicating that marking as given succeeded', () => {
        expect(
          wrapper.queryByTestId('notifications__notification'),
        ).toHaveTextContent(l10n.itemMarkAsGivenSuccess);
      });

      test('Hides the reply form', () => {
        expect(
          wrapper.queryByTestId('thread__reply__marked-as-given'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Clicking the item', () => {
    beforeEach(async () => {
      fireEvent.click(wrapper.getByTestId('item__link'));
      await waitFor(() =>
        expect(wrapper.queryByTestId('item')).toBeInTheDocument(),
      );
    });

    test('Navigates to the item page', () => {
      expect(wrapper.queryByTestId('item')).toBeInTheDocument();
    });
  });
});

describe('As the receiving user', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(thread);
    (threadMarkAsRead as jest.Mock)
      .mockClear()
      .mockResolvedValue({ status: 204 });
    wrapper = renderRouter(routes, [threadURL(thread.id.toString())], {
      user: thread.userReceiver,
    });
  });

  test("Does not render the 'mark as given' button", () => {
    expect(
      wrapper.queryByTestId('thread__item__mark-as-given'),
    ).not.toBeInTheDocument();
  });

  describe('Clicking the health and safety link', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('thread__health-and-safety'));
    });

    test('Goes to the health and safety page', () => {
      expect(wrapper.queryByTestId('health-and-safety')).toBeInTheDocument();
    });
  });
});
