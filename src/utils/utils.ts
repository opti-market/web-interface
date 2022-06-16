import {ethers} from 'ethers'
import {BigNumber} from '@ethersproject/bignumber'
import {Web3Provider} from '@ethersproject/providers'
import {
  isListed,
  getActiveListings,
  getCurrentListingPrice,
  getOffers
} from '../lib/contract-apis/marketplace'
import {OfferStructOutput} from '../lib/contract-apis/types/Marketplace'
import {totalSupply} from '../lib/contract-apis/erc721Enumerable'

// Import Artifacts per collection
import OptiPunks__Artifact from '../lib/contract-apis/artifacts/OptiPunks.json'
import OptimisticBunnies__Artifact from '../lib/contract-apis/artifacts/OptimisticBunnies.json'
import PixelBunnies__Artifact from '../lib/contract-apis/artifacts/PixelBunnies.json'
import Octavas__Artifact from '../lib/contract-apis/artifacts/Octavas.json'
import Ethernauts__Artifact from '../lib/contract-apis/artifacts/Ethernauts.json'
import PixelPics__Artifact from '../lib/contract-apis/artifacts/PixelPics.json'
import Squibz__Artifact from '../lib/contract-apis/artifacts/Squibz.json'
import PixelConInvaders_Artifact from '../lib/contract-apis/artifacts/PixelConInvaders.json'
import ThalesRoyalePass_Artifact from '../lib/contract-apis/artifacts/ThalesRoyalePass.json'
import OptimisticApes_Artifact from '../lib/contract-apis/artifacts/OptimisticApes.json'

import ethernauts_overview_image from '../assets/images/collections/ethernauts_overview_42.png'

// Interfaces
export interface Web3Interface {
  account: Web3Provider | undefined
  chainId: number
  library: any
}

export interface WhitelistInterface {
  id: number,
  contractAddress__Mainnet: string,
  contractAddress__Kovan: string,
  contract_type: string,
  featured_image_url: string,
  overview_image: any,
  featured_metadata_url: string,
  name: string,
  slug: string,
  artifact: any,
  image_hash: string,
  image_format: string,
  placeholder_image: string,
  metadata_hash: string,
  ipfs_image_url: string,
  ipfs_metadata_url: string,
  image_name_prefix: string,
  first_token: number,
  token_count: number,
  token_count_current: number,
  asset_name_prefix: string,
  banner_image_url: string,
  tokenObjs: any,
  description: string,
  external_url: string,
  discord_url: string,
  twitter_username: string,
  ownerAddress__Mainnet: string,
  ownerAddress__Kovan: string,
  ownerRoyalty: number,
  ownerPGF: number,
  optimarket_handles_PGF: boolean
}


// BigNumbers
export const initZero = ethers.BigNumber.from(0)
export const initBidStruct: any = {
  price: initZero,
  timestamp: initZero,
  expiration: initZero,
  accepted: false,
  buyer: '',
  escrowed: false
}

// RPC URLs
export const OPTIMISM_KOVAN_RPC_URL = 'https://kovan.optimism.io'
export const OPTIMISM_MAINNET_RPC_URL = 'https://mainnet.optimism.io'
export const OPTIMISM_KOVAN_INFURA_URL = 'https://optimism-kovan.infura.io/v3/38e2c911901845d4be3f730b61c7da14'
export const OPTIMISM_MAINNET_INFURA_URL = 'https://optimism-mainnet.infura.io/v3/38e2c911901845d4be3f730b61c7da14'

// Optimism Kovan addresses
export const OPTI_KOVAN_MARKETPLACE_CONTRACT_ADDRESS = '0xb375a1b732EE4f50b15E31b084f1ca75b7CA708C'
export const OPTI_KOVAN_WETH9_ADDRESS = '0xbC6F6b680bc61e30dB47721c6D1c5cde19C1300d'
export const OPTI_KOVAN_OPM_ADDRESS = '0xc2883712A933345fc16684c9a5FF36eCA856D3a9'

// Optimism Mainnet addresses
export const OPTI_MAINNET_MARKETPLACE_CONTRACT_ADDRESS = '0xdfbeB835029FD7D6d342dFC38E17236078a3238f'
export const OPTI_MAINNET_WETH9_ADDRESS = '0x4200000000000000000000000000000000000006'

export const COLLECTION_NAMES = [
  'OptiPunks',
  'OptimisticBunnies',
  'PixelBunnies',
  'Octavas',
  'EthernautDAO'
]

// Urls
export const OPTIMARKET_AWS_URL = 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/'
export const OPTIMISTIC_ETHERSCAN_URL = 'https://optimistic.etherscan.io/address/'


// OptiMarket Whitelist - Add any new collections here in order to display 
// them to components
export const whitelist: WhitelistInterface[] = [
  {
    id: 1,
    contractAddress__Mainnet: "0xB8Df6Cc3050cC02F967Db1eE48330bA23276A492",
    contractAddress__Kovan: "0x6E08949dA598FBadee9Cb0EfFcF45B593f1f390D",
    contract_type: "non-fungible",
    name: "OptiPunks",
    slug: 'optipunks',
    artifact: OptiPunks__Artifact,
    featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmbAhtqQqiSQqwCwQgrRB6urGc3umTskiuVpgX7FvHhutU/4100.png',
    overview_image: "",
    featured_metadata_url: "",
    image_hash: "QmbAhtqQqiSQqwCwQgrRB6urGc3umTskiuVpgX7FvHhutU",
    image_format: "png",
    placeholder_image: "",
    metadata_hash: "QmZYqgu73bpovLt7Y4kYfCPUbbgdRfvcsja8YZsprKismB",
    ipfs_image_url: "",
    ipfs_metadata_url: "",
    image_name_prefix: "",
    first_token: 0,
    token_count: 10000,
    token_count_current: 10000,
    asset_name_prefix: "OptiPunk",
    banner_image_url: "",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "10,000 unique collectible characters with proof of ownership stored on Optimism.",
    discord_url: "https://discord.gg/ANWXsx29rJ",
    external_url: "https://www.optipunks.com/",
    twitter_username: "https://twitter.com/OptiPunk",
    ownerAddress__Mainnet: "0x0bBD3a3d952fddf9A8811bC650445B7515a4B9e6",
    ownerAddress__Kovan: "",
    ownerRoyalty: 0,
    ownerPGF: 2,
    optimarket_handles_PGF: false
  },
  {
    id: 2,
    contractAddress__Mainnet: "0x52782699900DF91B58eCD618e77847C5774dCD2e",
    contractAddress__Kovan: "0xb87b4F704401930C968a29328e33DAa5F87e47c2",
    contract_type: "non-fungible",
    name: "Optimistic Bunnies",
    slug: 'optimisticbunnies',
    artifact: OptimisticBunnies__Artifact,
    featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmXx2N43aATdvM9WkKx81CofaayYgMuRPDdCoCdMvwZatP/bunny51.png',
    overview_image: "",
    featured_metadata_url: "",
    image_hash: "QmXx2N43aATdvM9WkKx81CofaayYgMuRPDdCoCdMvwZatP",
    image_format: "png",
    placeholder_image: "",
    metadata_hash: "QmT2Hsw7rMCexjbBkskvjStXJNohCEc52BgXKLQjTSg9Fs",
    ipfs_image_url: "",
    ipfs_metadata_url: "",
    image_name_prefix: "bunny",
    first_token: 1,
    token_count: 5151,
    token_count_current: 2469,
    asset_name_prefix: "Optimistic Bunny",
    banner_image_url: "",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "Optimistic Bunnies is a collection of 5,151 unique bunnies featuring 112 different accessories and traits.",
    discord_url: "https://discord.gg/sYaVNwhz8e",
    external_url: "https://www.optimisticbunnies.com/",
    twitter_username: "https://twitter.com/OPBunnies",
    ownerAddress__Mainnet: "0x42D4Cb9514710D8B90e790AA80Ac3cc635b66589",
    ownerAddress__Kovan: "",
    ownerRoyalty: 0,
    ownerPGF: 0,
    optimarket_handles_PGF: true
  },
  {
    id: 3,
    contractAddress__Mainnet: "0xc58c9a631ce193fC3F2Bb190Ab5Ba1BE181c09D1",
    contractAddress__Kovan: "0xd96a43b6e7ba11405d1ebd655fbbb81dce871879",
    contract_type: "non-fungible",
    name: "Circular Art: Octavas",
    slug: 'octavas',
    artifact: Octavas__Artifact,
    featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmdubuSea3FrptVJNxcwWRyRvmqyUBb4u3KXjNJ7nzg8aK/420.png',
    overview_image: "",
    featured_metadata_url: "",
    image_hash: "QmdubuSea3FrptVJNxcwWRyRvmqyUBb4u3KXjNJ7nzg8aK",
    image_format: "png",
    placeholder_image: "",
    metadata_hash: "Qmc6otBFDRwAxiLyXtjoF4PXGF972fUXh2LinfJ8UsqywG",
    ipfs_image_url: "",
    ipfs_metadata_url: "",
    image_name_prefix: "",
    first_token: 1,
    token_count: 981,
    token_count_current: 784,
    asset_name_prefix: "Octava",
    banner_image_url: "",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "Octavas - Generative art cllection #1 by Circular Art funding public goods",
    discord_url: "https://discord.gg/x9WDWApECc",
    external_url: "https://www.circularart.xyz/",
    twitter_username: "https://twitter.com/Circular_Art",
    ownerAddress__Mainnet: "0x0bBD3a3d952fddf9A8811bC650445B7515a4B9e6",
    ownerAddress__Kovan: "",
    ownerRoyalty: 0,
    ownerPGF: 2,
    optimarket_handles_PGF: false
  },
  {
    id: 4,
    contractAddress__Mainnet: "0x7c230d7a7efbf17b2ebd2aac24a8fb5373e381b7",
    contractAddress__Kovan: "",
    contract_type: "non-fungible",
    name: "Pixel Bunnies",
    slug: 'pixelbunnies',
    artifact: PixelBunnies__Artifact,
    featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmXGpq5ogcjnKji3ySGccXHhbCfTho2wgMxpcub1u9XiL6/pixel11.png',
    overview_image: "",
    featured_metadata_url: "",
    image_hash: "QmXGpq5ogcjnKji3ySGccXHhbCfTho2wgMxpcub1u9XiL6",
    image_format: "png",
    placeholder_image: "",
    metadata_hash: "QmegSrDAZZRGKhEf4cwCje4ZRmXfxjTxwUMCwD2J5NqXE3",
    ipfs_image_url: "",
    ipfs_metadata_url: "",
    image_name_prefix: "pixel",
    first_token: 1,
    token_count: 5151,
    token_count_current: 2469,
    asset_name_prefix: "Pixel Bunny",
    banner_image_url: "",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "Optimistic Bunnies stepped through a pixelator and became Pixel Bunnies. Follow these bunnies down the rabbit hole to find out what they are all about.",
    discord_url: "https://discord.gg/sYaVNwhz8e",
    external_url: "https://www.optimisticbunnies.com/",
    twitter_username: "https://twitter.com/OPBunnies",
    ownerAddress__Mainnet: "0xFF1F0Db809b728919BF0ED9FD7A14AfC1a251dBe",
    ownerAddress__Kovan: "",
    ownerRoyalty: 5,
    ownerPGF: 0,
    optimarket_handles_PGF: true
  },
  {
    id: 5,
    contractAddress__Mainnet: "0xA433e0Bf662Dd934833C66D4f03711e1CCE9c9B2",
    contractAddress__Kovan: "",
    contract_type: "non-fungible",
    name: "EthernautDAO",
    slug: 'ethernauts',
    artifact: Ethernauts__Artifact,
    featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/ethernauts/images/41.png',
    overview_image: ethernauts_overview_image,
    featured_metadata_url: "",
    image_hash: "ethernauts/images",
    image_format: "png",
    placeholder_image: "travel_to_destination",
    metadata_hash: "ethernauts/jsons",
    ipfs_image_url: "",
    ipfs_metadata_url: "ipfs://QmZ9xw7UzMLS6ETLMdJQDuYm3oUmgNiMvLQhNUUrYocBzY",
    image_name_prefix: '',
    first_token: 1,
    token_count: 10000,
    token_count_current: 162,
    asset_name_prefix: "Ethernaut",
    banner_image_url: "",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "EthernautDAO - Solidifying the Future. Discover the gateway to the web3 galaxy with 10,000 habitable planets to explore.",
    discord_url: "https://discord.gg/RQ5WYDxUF3",
    external_url: "https://mint.ethernautdao.io/",
    twitter_username: "https://twitter.com/EthernautDAO",
    ownerAddress__Mainnet: "0x2431BFA47bB3d494Bd720FaC71960F27a54b6FE7",
    ownerAddress__Kovan: "",
    ownerRoyalty: 5,
    ownerPGF: 0,
    optimarket_handles_PGF: true
  },
  {
    id: 6,
    contractAddress__Mainnet: "0xB5AbC2aa4b14E836cD202A43f53f463E6589f91B",
    contractAddress__Kovan: "",
    contract_type: "non-fungible",
    name: "Squibz",
    slug: 'squibz',
    artifact: Squibz__Artifact,
    featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/squibz/featured_image_url.gif',
    overview_image: "https://optimarket-imgs.s3.us-east-2.amazonaws.com/squibz/featured_image_url.gif",
    featured_metadata_url: "",
    image_hash: "QmSfbF2aUFhdHqS8juw9MxGmEP1djnvi7GoWzLaqqAvBdS",
    image_format: "png",
    placeholder_image: "",
    metadata_hash: "QmaKLZgRmtrqTyt8NFvvxgRVRHjKugsvs2zwypCWNQJW2S",
    ipfs_image_url: "ipfs://QmSfbF2aUFhdHqS8juw9MxGmEP1djnvi7GoWzLaqqAvBdS",
    ipfs_metadata_url: "ipfs://QmaKLZgRmtrqTyt8NFvvxgRVRHjKugsvs2zwypCWNQJW2S",
    image_name_prefix: '',
    first_token: 1,
    token_count: 10000,
    token_count_current: 18,
    asset_name_prefix: "Squib",
    banner_image_url: "https://optimarket-imgs.s3.us-east-2.amazonaws.com/squibz/banner_image_url.png",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "10,000 unique collectible characters on Optimism. There are 5 ultimates in the collection, happy hunting!",
    discord_url: "https://discord.gg/ah6vDdMC45",
    external_url: "https://squibz.ink/",
    twitter_username: "https://twitter.com/squibznft",
    ownerAddress__Mainnet: "0x756EB192e4bCc75B22e3E0eCEbBa263eF9a75C6D",
    ownerAddress__Kovan: "",
    ownerRoyalty: 1,
    ownerPGF: 1,
    optimarket_handles_PGF: true
  },
  {
    id: 7,
    contractAddress__Mainnet: "0x74E126813ecEdfF5588BB56931Bb26B3e321023F",
    contractAddress__Kovan: "",
    contract_type: "non-fungible",
    name: "Pixel Pics",
    slug: 'pixelpics',
    artifact: PixelPics__Artifact,
    featured_image_url: "https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmYeYMCpb4LUUDE4m2MMBpL7uwirYcw9eXHSifRu1cjxCW/pixelpics_preview.gif",
    overview_image: "https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmYeYMCpb4LUUDE4m2MMBpL7uwirYcw9eXHSifRu1cjxCW/pixelpics_preview.gif",
    featured_metadata_url: "",
    image_hash: "QmYeYMCpb4LUUDE4m2MMBpL7uwirYcw9eXHSifRu1cjxCW",
    image_format: "png",
    placeholder_image: "",
    metadata_hash: "QmdXQLJWkv27YFLxJ33piMBpxmL6236TdrsD1Lh8n33WXU",
    ipfs_image_url: "ipfs://QmYeYMCpb4LUUDE4m2MMBpL7uwirYcw9eXHSifRu1cjxCW/",
    ipfs_metadata_url: "ipfs://QmdXQLJWkv27YFLxJ33piMBpxmL6236TdrsD1Lh8n33WXU/",
    image_name_prefix: '',
    first_token: 1,
    token_count: 114,
    token_count_current: 5,
    asset_name_prefix: "Pixel Pics",
    banner_image_url: "https://optimarket-imgs.s3.us-east-2.amazonaws.com/QmYeYMCpb4LUUDE4m2MMBpL7uwirYcw9eXHSifRu1cjxCW/pixelpics_banner.png",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "114 pixelized editions of photos some dude has taken over the last few years.",
    discord_url: "",
    external_url: "https://www.pixelpics.xyz/",
    twitter_username: "https://twitter.com/ftpunchsamurai",
    ownerAddress__Mainnet: "0xc047e0d2156d5B45Ce8441df6C31Ae2B5FA51133",
    ownerAddress__Kovan: "0xc047e0d2156d5B45Ce8441df6C31Ae2B5FA51133",
    ownerRoyalty: 1,
    ownerPGF: 1.5,
    optimarket_handles_PGF: true
  },
  {
    id: 8,
    contractAddress__Mainnet: "0x4d40396b4Eb19Be0C1cE1B9544608068bDF6b0fC",
    contractAddress__Kovan: "",
    contract_type: "non-fungible",
    name: "Optimistic Apes",
    slug: 'optimisticapes',
    artifact: OptimisticApes_Artifact,
    featured_image_url: 'https://optimisticapes.com/collectionData/pfpSmaller.gif',
    overview_image: "https://optimisticapes.com/collectionData/pfpSmaller.gif",
    featured_metadata_url: "",
    image_hash: "",
    image_format: "jpg",
    placeholder_image: "",
    metadata_hash: "",
    ipfs_image_url: "https://optimisticapes.com/optimistic_apes/optimistic_apes_token",
    ipfs_metadata_url: "https://optimisticapes.com/tokens/",
    image_name_prefix: "",
    first_token: 1,
    token_count: 2300,
    token_count_current: 248,
    asset_name_prefix: "Optimistic Ape",
    banner_image_url: "https://optimisticapes.com/collectionData/bannerSmaller.png",
    tokenObjs: [{id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}],
    description: "The first ape collection on Optimism, with over 50% of mints donated directly to Optimism.",
    discord_url: "https://discord.gg/ffjBGcwMYv",
    external_url: "https://optimisticapes.com/",
    twitter_username: "https://twitter.com/OptimisticApes",
    ownerAddress__Mainnet: "0xe1FCad4D57b03CCBa4DDbAAC0728455a0489D3E9",
    ownerAddress__Kovan: "",
    ownerRoyalty: 0,
    ownerPGF: 0,
    optimarket_handles_PGF: true
  },
  // {
  //   id: 8,
  //   contractAddress__Mainnet: "0xB5604Fc106074A140DF727Fe28cd68F0dbB6C1B9",
  //   contractAddress__Kovan: "0x6F37e8ec6BAEa74C5fdE46C3B1dF583D1E1d55C8",
  //   contract_type: "non-fungible",
  //   name: "PixelConInvaders",
  //   slug: 'pixelconinvaders',
  //   artifact: PixelConInvaders_Artifact,
  //   featured_image_url: '',
  //   overview_image: "",
  //   featured_metadata_url: "",
  //   image_hash: "",
  //   image_format: "png",
  //   placeholder_image: "",
  //   metadata_hash: "",
  //   ipfs_image_url: "",
  //   ipfs_metadata_url: "",
  //   image_name_prefix: "",
  //   first_token: 1,
  //   token_count: 41,
  //   token_count_current: 41,
  //   asset_name_prefix: "",
  //   banner_image_url: "https://invaders.pixelcons.io/img/banner.png",
  //   tokenObjs: [{ id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0 }],
  //   description: "On-Chain Generative NFTs Powered by PixelCons! Bridged over from L1!",
  //   discord_url: "https://discord.gg/https://discord.com/invite/E2WQa8sTk3",
  //   external_url: "https://invaders.pixelcons.io/img/banner.png%22",
  //   twitter_username: "@PixelConsToken",
  //   ownerAddress__Mainnet: "0x9f2fedFfF291314E5a86661e5ED5E6f12e36dd37",
  //   ownerAddress__Kovan: "0x9f2fedFfF291314E5a86661e5ED5E6f12e36dd37",
  //   ownerRoyalty: 0,
  //   ownerPGF: 0,
  //   optimarket_handles_PGF: true
  // },
  //   {
  //     id: 9,
  //     contractAddress__Mainnet: "0x2F71f4a2D8BAB9703fff3fF5794762bF5b6C7E29",
  //     contractAddress__Kovan: "",
  //     contract_type: "fungible",
  //     name: "Thales Royale Pass",
  //     slug: 'thalesroyalepass',
  //     artifact: ThalesRoyalePass_Artifact,
  //     featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/thales/pass.gif',
  //     overview_image: "https://optimarket-imgs.s3.us-east-2.amazonaws.com/thales/thales_logo.png",
  //     featured_metadata_url: "",
  //     image_hash: "thales",
  //     image_format: "png",
  //     placeholder_image: "",
  //     metadata_hash: "",
  //     ipfs_image_url: "",
  //     ipfs_metadata_url: "",
  //     image_name_prefix: "",
  //     first_token: 1,
  //     token_count: 54,
  //     token_count_current: 54,
  //     asset_name_prefix: "",
  //     banner_image_url: "https://optimarket-imgs.s3.us-east-2.amazonaws.com/thales/Thales_Banner.png",
  //     tokenObjs: [{ id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0 }],
  //     description: "This pass allows you to sign up for a single Thales Royale Event with a buy-in of 30 sUSD. Once used this pass will be burned",
  //     discord_url: "https://discord.com/invite/rB3AWKwACM",
  //     external_url: "https://thalesmarket.io/",
  //     twitter_username: "https://twitter.com/thalesmarket",
  //     ownerAddress__Mainnet: "0xE853207c30F3c32Eda9aEfFDdc67357d5332978C",
  //     ownerAddress__Kovan: "",
  //     ownerRoyalty: 1,
  //     ownerPGF: 0,
  //     optimarket_handles_PGF: true
  //   }
]


/** Empty template for new collections
{
  id: 1,
  contractAddress__Mainnet: "",
  contractAddress__Kovan: "",
  contract_type: "non-fungible",
  name: "",
  slug: '',
  artifact: ,
  featured_image_url: 'https://optimarket-imgs.s3.us-east-2.amazonaws.com/HASH/IMG',
  overview_image: "",
  featured_metadata_url: "",
  image_hash: "",
  image_format: "png",
  placeholder_image: "",
  metadata_hash: "",
  ipfs_image_url: "",
  ipfs_metadata_url: "",
  image_name_prefix: "",
  first_token: 1,
  token_count: 10000,
  token_count_current: 10000,
  asset_name_prefix: "",
  banner_image_url: "",
  tokenObjs: [{ id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0 }],
  description: "",
  discord_url: "",
  external_url: "",
  twitter_username: "",
  ownerAddress__Mainnet: "",
  ownerAddress__Kovan: "",
  ownerRoyalty: 0,
  ownerPGF: 0,
  optimarket_handles_PGF: true
}
*/

let collectionNames: string[] = []

whitelist.forEach((collection: any) => {
  collectionNames.push(collection.name)
})

export const whitelistCollectionNames = collectionNames


// Functions
export const findCollection = (searchSpace: any, collectionSlug: any) => {
  const collection = searchSpace.find(
    (eachCollection: any) => eachCollection.slug == collectionSlug
  )
  return collection as WhitelistInterface
}

export const getCollection = (collectionSlug: any, setCollection: any) => {
  const collection = findCollection(whitelist, collectionSlug)
  setCollection(collection)
}

export function parseCollection(collection: any) {
  if (collection !== undefined) return JSON.parse(JSON.stringify(collection))
}

export async function getTotalSupply(assetCollection: any, chainId: number) {
  let currentTokenCount_: any = initZero

  await totalSupply(assetCollection, chainId).then(
    response => currentTokenCount_ = response
  )

  const currentTokenCount = Number(
    parseFloat(
      ethers.utils.formatEther(currentTokenCount_)
    ) * (1e18)
  )

  return currentTokenCount
}


export function tokenImageURL(tokenId: any, collection: any) {
  let file_type = 'png'
  if (collection.image_format === 'jpg') file_type = 'jpg'

  let tokenImgUrl: string = `${ OPTIMARKET_AWS_URL }${ collection.image_hash }/${ collection.image_name_prefix }${ tokenId }.${ file_type }`,
    tokenId_: number = parseInt(tokenId)

  // If the collection does not have AWS links, use the ipfs links
  if (collection.image_hash === "") tokenImgUrl = `${ collection.ipfs_image_url }${ tokenId }.${ file_type }`

  // If the collection has not minted all tokens, then use the placeholder image for tokens > the current count
  if (
    collection.token_count_current &&
    (collection.token_count_current < collection.token_count) &&
    (tokenId_ > (collection.token_count_current + collection.first_token - 1))
  ) {
    tokenImgUrl = `${ OPTIMARKET_AWS_URL }${ collection.image_hash }/${ collection.placeholder_image }.${ file_type }`
  }

  if (collection.contract_type === "fungible") tokenImgUrl = collection.featured_image_url

  return tokenImgUrl
}


export const loadTokenObjsArray = (tokenIndex: number, countToLoad: number) => {
  const setOfTokenObjs: any = []
  for (let i = 0; i < countToLoad; i++) {
    let tokenObj: any = {id: 0, tokenId: 0, price: 0, activeOffer: 0, rarity: 0}
    tokenObj.id = tokenIndex
    tokenObj.tokenId = tokenIndex
    setOfTokenObjs.push(tokenObj)
    tokenIndex++
  }
  return setOfTokenObjs
}


// Async functions
export async function getMetadata(
  collection: any,
  tokenId: any,
  setMetadata: any
) {
  if (collection) {
    let metadataUrl = `${ OPTIMARKET_AWS_URL }${ collection.metadata_hash }/${ collection.image_name_prefix }${ tokenId }.json`

    // If the collection does not have AWS links, use the ipfs links
    if (collection.metadata_hash === "") metadataUrl = `${ collection.ipfs_metadata_url }${ tokenId }.json`

    const response = await fetch(
      metadataUrl,
      {method: 'GET'}
    )

    const nftObj = await response.json()

    setMetadata(nftObj)
  }
}

export const fetchTokenPrice = async (
  collectionAddress,
  tokenId,
  account,
  chainId,
  library
) => {
  let tokenId_: any = ethers.BigNumber.from(tokenId),
    account_: string = account,
    listingPrice: string = '0.0'

  // If the chainId is not Optimism Kovan, then set it to mainnet to prevent
  // errors
  if (chainId !== 69) chainId = 10

  const isListed_: any = await isListed(
    collectionAddress,
    tokenId_,
    account_,
    chainId
  )

  if (isListed_) {    // Check that a conditional works here
    let tokenPrice = await getCurrentListingPrice(
      collectionAddress,
      tokenId_,
      chainId
    )
    listingPrice = ethers.utils.formatEther(tokenPrice)
  }
  return listingPrice;
}

export const fetchTokenOfferStatus = async (
  collectionAddress,
  tokenId,
  account,
  chainId,
  library
) => {
  let tokenId_: any = ethers.BigNumber.from(tokenId),
    account_: string = account,
    activeOffer: number = 0,
    activeOffers: any = []

  const getOffers_: any = await getOffers(
    collectionAddress,
    tokenId_,
    account_,
    chainId
  ) as OfferStructOutput[]

  if (getOffers_.length > 0 && getOffers_[0][0]) {

    getOffers_.map((offer_: any) => {
      /**
       * @dev offer[0] == price: BigNumber
       *      offer[1] == timestamp: BigNumber
       *      offer[2] == expiration: BigNumberv
       *      offer[3] == accepted: boolean
       *      offer[4] == buyer: string
       */
      let offer = [...offer_],
        price: BigNumber = offer[0],
        priceInETH = ethers.utils.formatEther(price),
        timestamp = offer[1],
        buyer: string = offer[4],
        priceFloat = parseFloat(priceInETH)

      // If an offer's price is 0, that will be removed from the offers list
      if (price.isZero()) return []
      else {
        // offer.push(priceInETH)

        if (activeOffers[0] && (priceFloat < activeOffers[0]))
          activeOffers.push(priceFloat)
        // Add all highest offers to the beginning of the array
        else activeOffers.unshift(priceFloat)
      }
    })
    // If there is an offer > 0, then set activeOffer to the highest
    if (activeOffers[0]) activeOffer = activeOffers[0]
  }
  return activeOffer
}


// Fetch all listed tokens for this collection
export async function fetchActiveListings(
  collectionAddress: string,
  chainId: number,
  sortBy: any
) {
  if (chainId !== 10 && chainId !== 69) chainId = 10

  const activeListings_ = await getActiveListings(
    collectionAddress,
    chainId
  )

  const listingsNumber = activeListings_.map(tokenIdBN => {
    let tokenString: string = ethers.utils.formatUnits(tokenIdBN, 0)
    let tokenId: number = parseInt(tokenString, 10)

    return tokenId
  })

  // Filter out any activeListings duplicates
  const uniqueListings: any = [...new Set(listingsNumber)]

  let listingsWithPrices: any[] = [],
    tokenPrice: any,
    listPrice: any

  for (let i = 0; i < uniqueListings.length; i++) {
    let tokenObj: any = {
      id: 0,
      tokenId: 0,
      price: 0,
      activeOffer: 0,
      rarity: 0
    }

    tokenObj.id = i
    tokenObj.tokenId = uniqueListings[i]

    tokenPrice = await getCurrentListingPrice(
      collectionAddress,
      tokenObj.tokenId,
      chainId
    )

    listPrice = ethers.utils.formatEther(tokenPrice)

    tokenObj.price = listPrice
    listingsWithPrices.push(tokenObj)
  }

  // Sort by the chosen sort filter, default is Price: Low to High
  const sortListings = sortBy(listingsWithPrices)

  return sortListings
}
