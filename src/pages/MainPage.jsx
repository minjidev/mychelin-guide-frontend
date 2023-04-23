import React from 'react';
import styled from 'styled-components';
import { fetchStores } from '../api/stores';
import { StoreItem, CategoryTag } from '../components/common';
import { StoreItemOnHover, Categories } from '../components/main';

const StoresContainer = styled.div`
  padding: 20px;
`;

const TopStoresContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RestStoresContainer = styled.div`
  margin-top: 20px;
  grid-gap: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const StoreItemContainer = styled.div`
  overflow: hidden;
  height: 350px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 30px;
  position: relative;
  transition: 0.1s ease-in-out;

  :hover {
    scale: 1.02;
  }

  :hover > main {
    transition: 0.1s ease-in-out;
    background-color: rgba(0, 0, 0, 0.8);

    div {
      display: flex;
    }

    img {
      display: block;
    }
  }
`;

const filterFetchedStores = (stores, category, searchInput) => {
  if (category === 'AL00' && !searchInput) return stores;

  const filteredByCategory = stores.filter(({ votesByCategory }) => Object.keys(votesByCategory).includes(category));
  const filteredByUserSearch = !searchInput
    ? filteredByCategory
    : filteredByCategory.filter(({ storeName }) => storeName.includes(searchInput));

  return filteredByUserSearch;
};

const MainPage = () => {
  const [displayedStores, setDisplayedStores] = React.useState({ topThree: [], remaining: [] });
  const [category, setCategory] = React.useState('AL00');
  const [searchInput, setSearchInput] = React.useState(''); // Todo: Must lift this state up

  React.useEffect(() => {
    (async () => {
      try {
        const allStores = await fetchStores();
        const filteredStores = filterFetchedStores(allStores, category, searchInput);
        const toDisplay = { topThree: filteredStores.splice(0, 3), remaining: filteredStores };

        setDisplayedStores(toDisplay);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [category, searchInput]);

  const changeCategory = newCategory => {
    setCategory(newCategory);
  };

  return (
    <>
      <Categories category={category} changeCategory={changeCategory} />
      <StoresContainer>
        <TopStoresContainer>
          {displayedStores.topThree.map(({ storeId, storeName, imgUrl }) => (
            <StoreItemContainer key={storeId}>
              <StoreItemOnHover storeId={storeId} />
              <StoreItem key={storeName} storeName={storeName} imgUrl={imgUrl} />
            </StoreItemContainer>
          ))}
        </TopStoresContainer>
        <RestStoresContainer>
          {displayedStores.remaining.map(({ storeId, storeName, imgUrl }) => (
            <StoreItemContainer key={storeId}>
              <StoreItemOnHover storeId={storeId} />
              <StoreItem key={storeName} storeName={storeName} imgUrl={imgUrl} />
            </StoreItemContainer>
          ))}
        </RestStoresContainer>
      </StoresContainer>
    </>
  );
};

export default MainPage;
