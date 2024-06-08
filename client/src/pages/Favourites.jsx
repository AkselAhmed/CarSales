import { useSelector } from "react-redux";
import { useMemo } from "react";
import Row from "react-bootstrap/Row";
import AdvertisementItem from "../Components/AdvertisementItem";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { removeFromFavorites } from "../features/favouritesSlice";

export default function Favourites() {
  const dispatch = useDispatch();

  const favouriteItems = useSelector(
    (state) => state?.favourites?.favouriteItems
  );

  const memoizedFavouriteItems = useMemo(
    () => favouriteItems,
    [favouriteItems]
  );

  function handleRemove(advertisement) {
    dispatch(removeFromFavorites(advertisement));
  }

  return (
    <Row className="justify-content-center align-items-center">
      {memoizedFavouriteItems.length > 0 ? (
        memoizedFavouriteItems.map((advertisement) => (
          <Row
            className="mx-3 d-flex w-auto h-auto position-relative"
            key={advertisement._id}
          >
            <Button
              onClick={() => handleRemove(advertisement)}
              className="w-auto position-absolute top-0 end-0 mt-3"
              variant="danger"
            >
              X
            </Button>
            <AdvertisementItem
              key={advertisement._id}
              advertisement={advertisement}
            />
          </Row>
        ))
      ) : (
        <p>You have not liked any advertisement yet.</p>
      )}
    </Row>
  );
}
