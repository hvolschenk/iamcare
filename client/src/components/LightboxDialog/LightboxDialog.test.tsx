import React from 'react';

import { fireEvent, render, RenderResult } from '~/src/testing';
import { image as imageMock } from '~/src/testing/mocks';
import { Image } from '~/src/types/Image';

import LightboxDialog from './index';

const images: Image[] = [imageMock(), imageMock(), imageMock()];

describe('Without a start index', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <LightboxDialog images={images} isOpen onClose={jest.fn()} />,
    );
  });

  test('Shows the first image', () => {
    expect(wrapper.queryByTestId('lightbox-dialog__image')).toHaveAttribute(
      'src',
      images[0].url,
    );
  });

  describe('Going to the next image', () => {
    describe('With the keyboard', () => {
      beforeEach(() => {
        fireEvent.keyDown(wrapper.getByTestId('lightbox-dialog'), {
          charCode: 39,
          code: 'ArrowRight',
          key: 'ArrowRight',
        });
      });

      test('Shows the next image', () => {
        expect(wrapper.queryByTestId('lightbox-dialog__image')).toHaveAttribute(
          'src',
          images[1].url,
        );
      });

      describe('Going further than the limit', () => {
        beforeEach(() => {
          for (let index = 0; index < images.length + 2; index += 1) {
            fireEvent.keyDown(wrapper.getByTestId('lightbox-dialog'), {
              charCode: 39,
              code: 'ArrowRight',
              key: 'ArrowRight',
            });
          }
        });

        test('Shows the last image', () => {
          expect(
            wrapper.queryByTestId('lightbox-dialog__image'),
          ).toHaveAttribute('src', images[images.length - 1].url);
        });
      });
    });

    describe('By clicking', () => {
      beforeEach(() => {
        fireEvent.click(wrapper.getByTestId('lightbox-dialog__action--next'));
      });

      test('Shows the next image', () => {
        expect(wrapper.queryByTestId('lightbox-dialog__image')).toHaveAttribute(
          'src',
          images[1].url,
        );
      });
    });
  });
});

describe('With a start index', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <LightboxDialog
        images={images}
        isOpen
        onClose={jest.fn()}
        startIndex={images.length - 1}
      />,
    );
  });

  test('Shows the image at the index', () => {
    expect(wrapper.queryByTestId('lightbox-dialog__image')).toHaveAttribute(
      'src',
      images[images.length - 1].url,
    );
  });

  describe('Going to the previous image', () => {
    describe('With the keyboard', () => {
      beforeEach(() => {
        fireEvent.keyDown(wrapper.getByTestId('lightbox-dialog'), {
          charCode: 37,
          code: 'ArrowLeft',
          key: 'ArrowLeft',
        });
      });

      test('Shows the previous image', () => {
        expect(wrapper.queryByTestId('lightbox-dialog__image')).toHaveAttribute(
          'src',
          images[images.length - 2].url,
        );
      });

      describe('Going further than the limit', () => {
        beforeEach(() => {
          for (let index = 0; index < images.length + 2; index += 1) {
            fireEvent.keyDown(wrapper.getByTestId('lightbox-dialog'), {
              charCode: 37,
              code: 'ArrowLeft',
              key: 'ArrowLeft',
            });
          }
        });

        test('Shows the first image', () => {
          expect(
            wrapper.queryByTestId('lightbox-dialog__image'),
          ).toHaveAttribute('src', images[0].url);
        });
      });
    });

    describe('By clicking', () => {
      beforeEach(() => {
        fireEvent.click(
          wrapper.getByTestId('lightbox-dialog__action--previous'),
        );
      });

      test('Shows the previous image', () => {
        expect(wrapper.queryByTestId('lightbox-dialog__image')).toHaveAttribute(
          'src',
          images[images.length - 2].url,
        );
      });
    });
  });
});
