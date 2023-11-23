import { faker } from '@faker-js/faker';
import React from 'react';

import threadGet from '~/src/api/threads/get';
import threadMarkAsRead from '~/src/api/threads/markAsRead';
import threadReply from '~/src/api/threads/reply';
import l10n from '~/src/l10n';
import {
  RenderResult,
  fireEvent,
  render,
  testUser,
  waitFor,
} from '~/src/testing';
import {
  message as messageMock,
  thread as threadMock,
} from '~/src/testing/mocks';

import Thread from './index';

jest.mock('~/src/api/threads/get');
jest.mock('~/src/api/threads/markAsRead');
jest.mock('~/src/api/threads/reply');

describe('When the API call fails', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (threadGet as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch'));
    wrapper = render(<Thread />);
    await waitFor(() => expect(threadGet).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('thread__error__retry')).toBeInTheDocument(),
    );
  });

  test('Renders an error message the retry button', () => {
    expect(wrapper.queryByTestId('thread__error__retry')).toBeInTheDocument();
  });

  describe('When retrying and the API call succeeds', () => {
    const thread = threadMock({ userGiver: testUser });

    beforeEach(async () => {
      (threadGet as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: thread, status: 200 });
      (threadMarkAsRead as jest.Mock)
        .mockClear()
        .mockResolvedValue({ status: 204 });
      fireEvent.click(wrapper.getByTestId('thread__error__retry'));
      await waitFor(() => expect(threadGet).toHaveBeenCalledTimes(1));
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
          fireEvent.click(
            wrapper.getByTestId('thread__reply__action--primary'),
          );
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
          fireEvent.click(
            wrapper.getByTestId('thread__reply__action--primary'),
          );
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
  });
});
