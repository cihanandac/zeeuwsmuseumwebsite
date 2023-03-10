import React from 'react';
import { useIntl, defineMessages } from 'react-intl';
import { getTeaserImageURL } from '../helpers';
import { flattenToAppURL } from '@plone/volto/helpers';
import { MaybeWrap } from '@plone/volto/components';
import { Message } from 'semantic-ui-react';
import cx from 'classnames';
// import navTreeSVG from '@plone/volto/icons/nav.svg';
import imageBlockSVG from '@plone/volto/components/manage/Blocks/Image/block-image.svg';

const messages = defineMessages({
  PleaseChooseContent: {
    id: 'Please choose an existing content as source for this element',
    defaultMessage:
      'Please choose an existing content as source for this element',
  },
  moreInfo: {
    id: 'moreInfo',
    defaultMessage: 'More info',
  },
  source: {
    id: 'Source',
    defaultMessage: 'Source',
  },
});

const SliderBody = ({
  index,
  onChangeBlock,
  block,
  data,
  dataBlock,
  isEditMode,
  openObjectBrowser,
}) => {
  const intl = useIntl();
  const href = data.href?.[0];
  const image = data.preview_image?.[0];

  // const handleClick = () => {
  //   openObjectBrowser({
  //     onSelectItem: (url, document) => {
  //       dataBlock.slides[index].title = document.Title;
  //       dataBlock.slides[index].description = document.Description;
  //       dataBlock.slides[index].href = [
  //         {
  //           '@id': document['@id'],
  //           Title: document.Title,
  //           Description: document.Description,
  //           title: document.Title,
  //           image_field: document.image_field,
  //           hasPreviewImage: document.hasPreviewImage,
  //         },
  //       ];
  //       onChangeBlock(block, dataBlock);
  //     },
  //     mode: 'link',
  //   });
  // };

  return (
    <div
      className={cx('grid-teaser-item top', {
        'empty-slide': !image && isEditMode,
      })}
    >
      {!image && isEditMode && (
        <Message>
          <div className="grid-teaser-item default">
            <img src={imageBlockSVG} alt="" />
            <p>{intl.formatMessage(messages.PleaseChooseContent)}</p>
            {/* <div className="toolbar-inner">
              <Button.Group>
                <Button onClick={handleClick} icon basic>
                  <Icon name={navTreeSVG} size="24px" />
                </Button>
              </Button.Group>
              <Input
                placeholder={`${intl.formatMessage(messages.source)}...`}
                onClick={handleClick}
                onFocus={(e) => e.target.blur()}
              />
            </div> */}
          </div>
        </Message>
      )}
      {image && (
        <div className="teaser-item top">
          <MaybeWrap
            condition={!isEditMode}
            target={null}
            tabIndex="-1"
            pointerEvents="none"
          >
            {(href?.hasPreviewImage || image) && (
              <div className="highlight-image-wrapper gradient">
                <img
                  src={flattenToAppURL(getTeaserImageURL(href, image, 'great'))}
                  alt=""
                  loading="lazy"
                />
              </div>
            )}
            <div className="teaser-item-title fix-width-issue">
              <div className="title">
                {data?.head_title && (
                  <span className="supertitle">{data?.head_title}</span>
                )}
                <h2>{data?.nav_title || data?.title}</h2>
              </div>
              <p>{data?.description}</p>
            </div>
          </MaybeWrap>
        </div>
      )}
    </div>
  );
};

export default SliderBody;
