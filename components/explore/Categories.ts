import explorer_books from '@/assets/images/explorer_books.png';
import { ImageSourcePropType } from 'react-native';

interface ExplorerItem {
  name: string;
  image: ImageSourcePropType;
  url: string;
}

const explorerData: ExplorerItem[] = [
  {
    name: 'Books',
    image: explorer_books,
    url: 'https://localhost:8081/books'
  }
];

export default explorerData;