import { AxiosError, AxiosHeaders, AxiosResponse } from 'axios';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import categories from '~/src/api/category/all';
import itemCreate from '~/src/api/items/create';
import l10n from '~/src/l10n';
import { useGooglePlaces } from '~/src/providers/GooglePlaces';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import {
  category as categoryMock,
  item as itemMock,
  user as userMock,
} from '~/src/testing/mocks';
import { userItems, userItemsCreate } from '~/src/urls';

import { Provider as UserProvider } from '../../context';

import CreateItem from './index';

jest.mock('~/src/api/category/all');
jest.mock('~/src/api/items/create');

let wrapper: RenderResult;

describe('When the categories fail to load', () => {
  beforeEach(async () => {
    (categories as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch categories'));
    wrapper = render(
      <UserProvider value={userMock()}>
        <Routes>
          <Route element={<CreateItem />} path={userItemsCreate()} />
          <Route
            element={<div data-testid="user-items" />}
            path={userItems()}
          />
        </Routes>
      </UserProvider>,
      { router: { initialEntries: [userItemsCreate('22')] } },
    );
    await waitFor(() => expect(categories).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('item-form__error__loading__retry'),
      ).toBeInTheDocument(),
    );
  });

  test('Shows the button to retry loading the categories', () => {
    expect(
      wrapper.queryByTestId('item-form__error__loading__retry'),
    ).toBeInTheDocument();
  });

  describe('When the categories load (on retry)', () => {
    const categoriesList = [categoryMock(), categoryMock(), categoryMock()];

    beforeEach(async () => {
      (categories as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: { data: categoriesList }, status: 200 });
      fireEvent.click(wrapper.getByTestId('item-form__error__loading__retry'));
      await waitFor(() => expect(categories).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(wrapper.queryByTestId('item-form')).toBeInTheDocument(),
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

      test('Shows the category field error', () => {
        expect(
          wrapper.queryByTestId('item-form__category__helper-text'),
        ).toHaveTextContent(l10n.itemCategoryErrorRequired);
      });

      test('Shows the location field error', () => {
        expect(
          wrapper.queryByTestId('item-form__location__helper-text'),
        ).toHaveTextContent(l10n.itemLocationErrorRequired);
      });

      describe('When the validation errors are corrected', () => {
        beforeEach(async () => {
          const autocompleteResponse: google.maps.places.AutocompleteResponse =
            {
              predictions: [
                {
                  description: 'A caring place',
                  matched_substrings: [{ length: 4, offset: 1 }],
                  place_id: '22',
                  structured_formatting: {
                    main_text: 'Care',
                    main_text_matched_substrings: [{ length: 4, offset: 1 }],
                    secondary_text: 'Care',
                  },
                  terms: [
                    {
                      offset: 1,
                      value: 'Care',
                    },
                  ],
                  types: ['sublocality'],
                },
                {
                  description: 'A loving place',
                  matched_substrings: [{ length: 4, offset: 1 }],
                  place_id: '222',
                  structured_formatting: {
                    main_text: 'Love',
                    main_text_matched_substrings: [{ length: 4, offset: 1 }],
                    secondary_text: 'Love',
                  },
                  terms: [
                    {
                      offset: 1,
                      value: 'Love',
                    },
                  ],
                  types: ['sublocality'],
                },
              ],
            };
          const { autocomplete } = useGooglePlaces();
          (autocomplete as jest.Mock)
            .mockClear()
            .mockResolvedValue(autocompleteResponse);
          fireEvent.change(wrapper.getByTestId('item-form__name'), {
            target: { value: 'iamcare' },
          });
          fireEvent.change(wrapper.getByTestId('item-form__description'), {
            target: { value: 'Care is love made visible' },
          });
          fireEvent.change(wrapper.getByTestId('item-form__category'), {
            target: { value: 'Care' },
          });
          fireEvent.blur(wrapper.getByTestId('item-form__category'));
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
              autocompleteResponse.predictions[0].structured_formatting
                .main_text,
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
              category: ['Not category-esque enough'],
              description: ['Not descriptive enough'],
              location: ['Not located enough'],
              name: ['Not name-y enough'],
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

            test('Shows the error for the category field', () => {
              expect(
                wrapper.queryByTestId('item-form__category__helper-text'),
              ).toHaveTextContent(validationErrors.category[0]);
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
  });
});
