import Nav from '../../../components/Nav'
import Sidebar from './components/sidebar';

export default function UserDashboard() {
  return (
    <>
    <Nav />
    <div className="flex">
      <div className="w-1/4">
       <Sidebar />
      </div>
      <div className="w-3/4">
        <p className="text-red-500">asdasdasd</p>
      </div>
    </div>
    </>
  );
}
