import AllImages from './AllImages'
import FeaturesImage from './FeaturesImage'
import LinkCard from './LinkCard'

interface PostTypeProps {
  type: 'isAllImages' | 'isFeaturedImage' | 'isLinkCard' | 'isProductImage' | 'onlyMessage'
}

export default function PostType({ type }: PostTypeProps) {
  switch (type) {
    case 'isAllImages': {
      return <AllImages />
    }
    case 'isFeaturedImage':
    case 'isProductImage': {
      return <FeaturesImage />
    }
    case 'isLinkCard': {
      return <LinkCard />
    }

    default:
  }
}
