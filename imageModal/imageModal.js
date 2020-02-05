import React, { useEffect, useState } from "react";
import { Modal } from "../components/common/modal";
import store from "../redux/store";
import { SHOW_IMAGE } from "../redux/types/types";
import { connect } from "react-redux";
import { getUserProfilePhoto } from "../utils/user";
import "./imageModal.css";
import AppIcon from "../components/common/icons/Icon";

function ImageModal(props) {
  const [imageModal, setImageModal] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [canNext, setCanNext] = useState(true);
  const [canPrev, setCanPrev] = useState(true);
  const onCloseModal = () => {
    store.dispatch({ type: SHOW_IMAGE, payload: false });
    setImageModal(false);
  };

  useEffect(() => {
    if (props.showImage) {
      setActiveImage(props.showImage.activeImage);
      setImageList(props.showImage.imageList);
      setImageModal(true);
    }
  }, [props.showImage]);

  useEffect(() => {
    if (activeImage) {
      if (activeImage.index === 0) {
        setCanPrev(false);
      } else {
        setCanPrev(true);
      }
      if (activeImage.index === imageList.length - 1) {
        setCanNext(false);
      } else {
        setCanNext(true);
      }
    }
  }, [activeImage]);

  const navigate = type => {
    let count = 1;
    if (type === "prev") {
      count = -1;
    }

    imageList.filter((item, index) => {
      if (index === activeImage.index + count) {
        setActiveImage({
          image: item.image,
          index
        });
      }
      return null;
    });
  };

  return (
    <Modal
      onClose={onCloseModal}
      closable
      visible={imageModal}
      infiniteWidth
      className="modalClass"
    >
      {activeImage && (
        <div className="image-modal">
          <div
            className="image-con-main"
            style={{
              backgroundImage:
                "url('" + getUserProfilePhoto(activeImage.image) + "')"
            }}
          />
          {imageList.length > 1 && (
            <div className="navControl">
              <div
                className={`prev ${!canPrev && "disabled"}`}
                onClick={() => navigate("prev")}
              >
                <AppIcon name="chevronLeft" type="feather" />
              </div>
              <div
                className={`next ${!canNext && "disabled"}`}
                onClick={() => navigate()}
              >
                <AppIcon name="chevronRight" type="feather" />
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    showImage: state.showImage
  };
};

export default connect(mapStateToProps)(ImageModal);
