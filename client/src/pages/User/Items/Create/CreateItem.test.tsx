import { faker } from '@faker-js/faker';
import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import React from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import itemCreate from '~/src/api/items/create';
import locationByGooglePlaceID from '~/src/api/locations/google';
import tags from '~/src/api/tag/all';
import l10n from '~/src/l10n';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import {
  fireEvent,
  renderRouter,
  RenderResult,
  waitFor,
  within,
} from '~/src/testing';
import {
  autocompleteResponse as autocompleteResponseMock,
  item as itemMock,
  locationBasic as locationBasicMock,
  tag as tagMock,
  user as userMock,
} from '~/src/testing/mocks';
import { userItems, userItemsCreate } from '~/src/urls';

import { Component as CreateItem } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useRouteLoaderData: jest.fn(),
  };
});
jest.mock('~/src/api/items/create');
jest.mock('~/src/api/locations/google');
jest.mock('~/src/api/tag/all');

const tagsList = [tagMock(), tagMock(), tagMock()];

let wrapper: RenderResult;

beforeEach(async () => {
  (tags as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: { data: tagsList }, status: 200 });
  (useRouteLoaderData as jest.Mock).mockClear().mockReturnValue(userMock());
  wrapper = renderRouter(
    [
      { Component: CreateItem, path: userItemsCreate() },
      { element: <div data-testid="user-items" />, path: userItems() },
    ],
    [userItemsCreate(faker.number.int().toString())],
  );
  await waitFor(() => expect(tags).toHaveBeenCalledTimes(1));
  await waitFor(() =>
    expect(wrapper.queryByTestId('item-form__tags')).not.toBeDisabled(),
  );
});

test('Renders the item form', () => {
  expect(wrapper.queryByTestId('item-form')).toBeInTheDocument();
});

describe('When there are validation errors', () => {
  beforeEach(async () => {
    fireEvent.click(wrapper.getByTestId('item-form__action--submit'));
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('item-form__name__helper-text'),
      ).toHaveTextContent(l10n.itemNameErrorRequired),
    );
  });

  test('Shows the name field error', () => {
    expect(
      wrapper.queryByTestId('item-form__name__helper-text'),
    ).toHaveTextContent(l10n.itemNameErrorRequired);
  });

  test('Shows the tag field error', () => {
    expect(
      wrapper.queryByTestId('item-form__tags__helper-text'),
    ).toHaveTextContent(l10n.itemTagsErrorRequired);
  });

  test('Shows the location field error', () => {
    expect(
      wrapper.queryByTestId('item-form__location__helper-text'),
    ).toHaveTextContent(l10n.itemLocationErrorRequired);
  });

  describe('When the validation errors are corrected', () => {
    beforeEach(async () => {
      const autocompleteResponse = autocompleteResponseMock();
      const { autocomplete } = useGooglePlaces();
      (autocomplete as jest.Mock)
        .mockClear()
        .mockResolvedValue(autocompleteResponse);
      (locationByGooglePlaceID as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: locationBasicMock(), status: 200 });
      fireEvent.change(wrapper.getByTestId('item-form__name'), {
        target: { value: 'iamcare' },
      });
      fireEvent.change(wrapper.getByTestId('item-form__description'), {
        target: { value: 'Care is love made visible' },
      });

      fireEvent.mouseDown(
        within(wrapper.getByTestId('tags-select__select')).getByRole(
          'combobox',
        ),
      );
      await waitFor(() =>
        expect(wrapper.getAllByTestId('tags-select__option')).toHaveLength(
          tagsList.length,
        ),
      );
      fireEvent.click(wrapper.getAllByTestId('tags-select__option')[0]);

      fireEvent.change(wrapper.getByTestId('item-form__location'), {
        target: { value: 'Ras' },
      });

      await waitFor(() => expect(autocomplete).toHaveBeenCalledTimes(1));

      await waitFor(() =>
        expect(
          wrapper.queryAllByTestId('place-autocomplete__suggestion').length,
        ).toBeGreaterThanOrEqual(1),
      );
      fireEvent.click(
        wrapper.getAllByTestId('place-autocomplete__suggestion')[0],
      );
      await waitFor(() =>
        expect(wrapper.getByTestId('item-form__location')).toHaveValue(
          autocompleteResponse.predictions[0].structured_formatting.main_text,
        ),
      );
      fireEvent.blur(wrapper.getByTestId('item-form__location'));

      const file = new File(['<3'], 'heart.png', { type: 'image/png' });
      fireEvent.change(wrapper.getByTestId('item-form__image-upload'), {
        target: { files: [file] },
      });
      await waitFor(() =>
        expect(
          wrapper.queryAllByTestId('file-upload__uploaded-item').length,
        ).toBeGreaterThanOrEqual(1),
      );
    });

    describe('When the API call fails', () => {
      describe('With validation errors', () => {
        const validationErrors: Record<string, string[]> = {
          description: ['Not descriptive enough'],
          location: ['Not located enough'],
          name: ['Not name-y enough'],
          tags: ['Not tags-esque enough'],
        };
        beforeEach(async () => {
          const headers = new AxiosHeaders();
          const response: AxiosResponse = {
            config: { headers },
            data: {
              errors: validationErrors,
              message: 'There were errors creating the item',
            },
            headers,
            status: 422,
            statusText: 'Unprocessable Content',
          };
          const error = new AxiosError(
            'Unprocessable Content',
            '422',
            undefined,
            undefined,
            response,
          );
          (itemCreate as jest.Mock).mockClear().mockRejectedValue(error);
          fireEvent.click(wrapper.getByTestId('item-form__action--submit'));
          await waitFor(() => expect(itemCreate).toHaveBeenCalledTimes(1));
        });

        test('Shows the error for the description field', () => {
          expect(
            wrapper.queryByTestId('item-form__description__helper-text'),
          ).toHaveTextContent(validationErrors.description[0]);
        });

        test('Shows the error for the location field', () => {
          expect(
            wrapper.queryByTestId('item-form__location__helper-text'),
          ).toHaveTextContent(validationErrors.location[0]);
        });

        test('Shows the error for the name field', () => {
          expect(
            wrapper.queryByTestId('item-form__name__helper-text'),
          ).toHaveTextContent(validationErrors.name[0]);
        });

        test('Shows the error for the tags field', () => {
          expect(
            wrapper.queryByTestId('item-form__tags__helper-text'),
          ).toHaveTextContent(validationErrors.tags[0]);
        });
      });

      describe('With a generic error', () => {
        beforeEach(async () => {
          const headers = new AxiosHeaders();
          const response: AxiosResponse = {
            config: { headers },
            data: null,
            headers,
            status: 500,
            statusText: 'Internal Server Error',
          };
          const error = new AxiosError(
            'Internal Server Error',
            '500',
            undefined,
            undefined,
            response,
          );
          (itemCreate as jest.Mock).mockClear().mockRejectedValue(error);
          fireEvent.click(wrapper.getByTestId('item-form__action--submit'));
          await waitFor(() => expect(itemCreate).toHaveBeenCalledTimes(1));
          await waitFor(() =>
            expect(
              wrapper.queryByTestId('notifications__notification'),
            ).toBeInTheDocument(),
          );
        });

        test('Shows a generic snackbar message', () => {
          expect(
            wrapper.getByTestId('notifications__notification'),
          ).toHaveTextContent(l10n.itemFormErrorCreating);
        });
      });
    });

    describe('When the API call succeeds', () => {
      const item = itemMock();

      beforeEach(async () => {
        (itemCreate as jest.Mock)
          .mockClear()
          .mockResolvedValue({ data: item, status: 200 });
        fireEvent.click(wrapper.getByTestId('item-form__action--submit'));
        await waitFor(() => expect(itemCreate).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('notifications__notification'),
          ).toBeInTheDocument(),
        );
      });

      test('Shows a success message', () => {
        expect(
          wrapper.getByTestId('notifications__notification'),
        ).toHaveTextContent(
          l10n.formatString(l10n.itemCreateSuccess, {
            itemName: item.name,
          }) as string,
        );
      });

      test("Redirects to the user's list of items", () => {
        expect(wrapper.queryByTestId('user-items')).toBeInTheDocument();
      });
    });
  });
});
