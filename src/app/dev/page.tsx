import { notFound } from 'next/navigation';
import ImportPanel from './ImportPanel';

export default function DevPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <ImportPanel />;
}
