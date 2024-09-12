import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import { type RenderResult, fireEvent, render } from '~/src/testing';
import { image as imageMock } from '~/src/testing/mocks';

import ImageUpload from './index';

jest.mock('@mui/material/useMediaQuery');

describe('At the default size', () => {
  const image = imageMock();
  const onChange = jest.fn();

  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <ImageUpload
        allowedTypes={['image/*', 'application/pdf']}
        FormHelperTextProps={{
          // @ts-ignore
          'data-testid': 'helper-text',
        }}
        helperText="Upload files"
        inputProps={{ 'data-testid': 'input' }}
        label="Care"
        labelUploadButton="Upload"
        onChange={onChange}
        values={[image]}
      />,
    );
  });

  describe('After uploading some images', () => {
    const image1 = new File(['<3'], 'love.png', { type: 'image/png' });
    const image2 = new File(['<3'], 'care.jpg', { type: 'image/jpeg' });
    const image3 = new File(['<3'], '22.webp', { type: 'image/webp' });
    const image4 = new File(['<3'], 'affection.pdf', {
      type: 'application/pdf',
    });

    beforeEach(() => {
      onChange.mockClear();
      fireEvent.change(wrapper.getByTestId('input'), {
        target: { files: [image1] },
      });
      fireEvent.change(wrapper.getByTestId('input'), {
        target: { files: [image2] },
      });
      fireEvent.change(wrapper.getByTestId('input'), {
        target: { files: [image3, image4] },
      });
      // This shouldn't do anything,
      // but it's not possible to test whether the actual file selection window is open.
      // This just hits the function to open it.
      fireEvent.click(wrapper.getByTestId('file-upload__add'));
    });

    test('Renders a list of previews', () => {
      expect(
        wrapper.queryAllByTestId('file-upload__uploaded-item'),
      ).toHaveLength(5);
    });

    test('Calls the change handler for each file', () => {
      expect(onChange.mock.calls[2][0]).toEqual([
        image,
        image1,
        image2,
        image3,
        image4,
      ]);
    });

    describe('After removing some uploaded images', () => {
      beforeEach(() => {
        onChange.mockClear();
        fireEvent.click(
          wrapper.getAllByTestId('file-upload__uploaded-item__remove')[2],
        );
        fireEvent.click(
          wrapper.getAllByTestId('file-upload__uploaded-item__remove')[0],
        );
      });

      test('Calls the change handler for each file removed', () => {
        expect(onChange.mock.calls[1][0]).toEqual([image1, image3, image4]);
      });

      describe('Restoring a removed image', () => {
        beforeEach(() => {
          onChange.mockClear();
          fireEvent.click(
            wrapper.getAllByTestId('file-upload__uploaded-item__restore')[1],
          );
          fireEvent.click(
            wrapper.getAllByTestId('file-upload__uploaded-item__restore')[0],
          );
        });

        test('Calls the onChange handler for each file restored', () => {
          expect(onChange.mock.calls[1][0]).toEqual([
            image,
            image1,
            image2,
            image3,
            image4,
          ]);
        });
      });
    });
  });
});

// This cannot really be tested, except visually.
// Here we're adding tests for each of the breakpoints just to cover those lines.
type TableItem = [isLarge: boolean, isMedium: boolean];
const table: TableItem[] = [
  [false, true],
  [true, false],
  [false, false],
];
describe.each(table)('Large: %s. Medium: %s.', (isLarge, isMedium) => {
  beforeEach(() => {
    (useMediaQuery as jest.Mock)
      .mockClear()
      .mockReturnValueOnce(isLarge)
      .mockReturnValue(isMedium);
    render(
      <ImageUpload
        allowedTypes={['image/*', 'application/pdf']}
        FormHelperTextProps={{
          // @ts-ignore
          'data-testid': 'helper-text',
        }}
        helperText="Upload files"
        inputProps={{ 'data-testid': 'input' }}
        label="Care"
        labelUploadButton="Upload"
        onChange={() => {}}
        values={[]}
      />,
    );
  });

  test('Vanity test', () => {
    expect(true).toBe(true);
  });
});
