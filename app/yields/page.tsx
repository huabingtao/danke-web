import ReturnHome from '@/components/ReturnHome';
import ResourceAcquisitionClient from '@/components/ResourceAcquisitionClient';
export const metadata = { title: '资源获取 | 弹壳攻略站', description: '按道具或玩法查看弹壳特攻队资源的已录入获取途径与数量。' };
export default function Page() {
  return <main className="site-container pt-6 pb-7 sm:pt-8">
        <ReturnHome /><ResourceAcquisitionClient /></main>;
}
