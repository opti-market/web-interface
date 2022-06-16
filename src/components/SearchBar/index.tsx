/* External imports */
import React, { useState } from "react"
import styled from 'styled-components'
import { Search } from 'react-feather'
import { useNavigate } from "react-router-dom";

/* Internal imports */
import levDist from '../../utils/levenshtein'
import collectionsData from '../../utils/collectionsData.json'
// import {
//   findCollection,
//   whitelist,
//   WhitelistInterface
// } from '../../utils/utils'


const SearchBar = ({  }) => {
  const [searchTerm, setSearchTerm] = useState('')

  let navigate = useNavigate()

  const fullTextSearch = (term: any) => {
    const keys = term.split(' ')
    let collectionTerm: string = '',
      collectionNames: string[] = [],
      idTerm: any = '',
      isCollection: boolean = false
    
    if (keys.length === 1) isCollection = true
    else if (keys.length === 2) { 
      collectionTerm = keys[0]
      idTerm = keys[1]
    }
    else if (keys.length === 3) {
      collectionTerm = keys[0] + keys[1]
      idTerm = keys[2]
    }
    else if (keys.length === 4) {
      collectionTerm = keys[0] + keys[1] + keys[2]
      idTerm = keys[3]
    }

    let idNumber = idTerm.replace('#', ''),
      idToInteger = parseInt(idNumber),
      // Check to see if the last key/word is a number
      idIsInteger = Number.isInteger(idToInteger)

    // If the last value is not a number, then search for only a collection
    if(!idIsInteger) {
      collectionTerm = collectionTerm + idTerm
      isCollection = true
    }

    collectionsData.forEach((collection: any) => {
      collectionNames.push(collection.name)
    })

    let levDistArray: any = []

    for (let i = 0; i < collectionNames.length; i++) {
      let collectionLD = levDist(collectionTerm, collectionNames[i])

      levDistArray[i] = collectionLD
    }
  
    const indexMinLevDist = levDistArray.indexOf(Math.min(...levDistArray));
    const collectionSlug = collectionsData[indexMinLevDist].name.toLowerCase()

    if(!isCollection && idIsInteger) {

      const tokenMatch: any = collectionsData[indexMinLevDist].tokenIds.find(
        tokenId => idToInteger == tokenId
      )

      // Navigate to the asset's details page
      navigate(`/AssetDetails/${ collectionSlug }/${ tokenMatch }`)
    }
    
    else if (isCollection) navigate(`/collection/${ collectionSlug }`)
    else {
      alert(
        'No results found. Please try searching using a "COLLECTION_NAME" or "COLLECTION_NAME TOKEN_ID".'
      )
    }
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    fullTextSearch(searchTerm)
    setSearchTerm('')
  }


  return (
    <SearchWrap>
      <SearchForm onSubmit={handleSubmit}>
        <Icon>
          <Search size={20} />
        </Icon>
        <Input
          value={searchTerm}
          placeholder={"Search NFTs or Collections"}
          onChange={(e) => setSearchTerm(e.target.value)}
          id={"searchbar"}
          type="text"
        />
        <Button type="submit">Submit</Button>
      </SearchForm>
    </SearchWrap>

  )
}


const SearchWrap = styled.div`
  display: flex;
  flex-direction: column;

  border-radius: 3rem;
  border: 1.7px solid ${ ({ theme }) => theme.primary2 };

  width: 100%;
  margin: auto;

  font-weight: 700;

  ${ ({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

const SearchForm = styled.form`
  display: flex;
  width: 100%;

  padding: 3px;
  font-weight: 700;
`

const Icon = styled.div`
  position: relative;
  top: 3px;
  left: 8px;

  color: grey;
`

const Input = styled.input`
  width: 100%;
  font-weight: 700;
  
  color: ${ ({ theme }) => theme.text2 };
  text-align: center;
  
  border: none;
  background: transparent;

  ::placeholder {
    color: ${ ({ theme }) => theme.text3 };
    font-weight: 500;
  }

  :focus {
    outline: 0;
    background:transparent;

    ::placeholder {
      color: transparent;
    }
  }
`

const Button = styled.button`
  font-weight: 700;
  margin-right: 8px;
  padding: 0;
  border: 0;

  cursor: pointer;
  
  color: ${ ({ theme }) => theme.text2 };
  background: transparent;

  :hover {
    color: ${ ({ theme }) => theme.primary2 };
  }

  :focus {
    outline: 0;
  }
`


export default SearchBar
