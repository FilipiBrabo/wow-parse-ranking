import { revalidateTag } from 'next/cache';

import { ICC_RANKINGS_TAG } from '../../constants';

export async function GET() {
  revalidateTag(ICC_RANKINGS_TAG, '');
  return new Response();
}
