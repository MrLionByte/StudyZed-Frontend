import { Wallet as WalletIcon } from 'lucide-react';

export default function Wallet() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-teal-900/30 rounded-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <WalletIcon className="h-16 w-16 text-emerald-400" />
        </div>

        <h1 className="text-4xl font-bold mb-6">RS 455.78</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Add to Wallet</h2>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg">
              RS 149
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-emerald-400 mb-3">
              Pay December Fees
            </h2>
            <p className="text-gray-300">RS 79</p>
          </div>
        </div>
      </div>
    </div>
  );
}
