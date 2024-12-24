import Nav from '../../../components/Nav'
import BoxButton from './components/BoxButton';

export default function UserDashboard() {
  return (
    <>
    <Nav />
    <div className="flex">
      <div className="w-1/4">
       <BoxButton />
      </div>
      <div className="w-3/4">
        <p className="text-red-500">asdasdasd</p>
      </div>
    </div>
    </>
  );
}
