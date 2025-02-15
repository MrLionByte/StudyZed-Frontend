export default function Dashboard (){
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
        <div className="lg:col-span-2 bg-teal-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Pending Tasks</h2>
          <div className="space-y-4">
           
          </div>
        </div>

      
        <div className="bg-teal-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Leaderboard</h2>
          <div className="space-y-3">
            {[
              { name: 'David Villa', score: 400 },
              { name: 'Mahesh PN', score: 355 },
              { name: 'Fernando Torres', score: 300 },
            ].map((user, index) => (
              <div
                key={user.name}
                className="flex items-center justify-between bg-teal-900/50 p-3 rounded"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-400">#{index + 1}</span>
                  <span>{user.name}</span>
                </div>
                <span className="font-semibold">{user.score}</span>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    )
}