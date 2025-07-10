import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: '74ccdd' }, { name: 'description', content: ':D' }];
};

export default function Index() {
  return <></>;
}
