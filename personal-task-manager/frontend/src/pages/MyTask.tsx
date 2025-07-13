import Header from "../components/header";
import searchIcon from "../assets/search.png";
import descIcon from "../assets/desc.png";
import TaskCard from "../components/taskCard";
import { useEffect , useState} from "react";
import axios from "axios";


function MyTask() {

  const [tasks , setTasks] = useState([])
  async function fetchTasks() {
    console.log(`${import.meta.env.VITE_FETCH_URL}`);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_FETCH_URL}/tasks`
      );
      const data = response.data;
      return data;
    } catch (error) {
      return { error };
    }
  }

  useEffect(() => {
    let data2 = null;
    const initialData = async () => {
      data2 = await fetchTasks();
      setTasks(data2)
      console.log(data2);
    };
    initialData();
  }, []);
  return (
    <>
      <Header></Header>
      <div className="flex flex-col p-8 gap-4">
        <div className="flex">
          <h1 className="font-bold text-3xl justify-start">My Tasks</h1>
        </div>
        <div className="flex place-content-between">
          <div className="flex gap-5">
            <button>
              <img src={searchIcon} alt="" className="w-7" />
            </button>
            <button>
              <img src={descIcon} alt="" className="w-7" />
            </button>
          </div>
          <button className="w-[25%] h-12 my-4 rounded-md bg-black text-white font-bold">
            Add Task
          </button>
        </div>

        <div>
          <div className="flex gap-6 border-gray-400 border-b-1 pb-4">
            <span className="font-medium">All</span>
            <span className="font-medium">Incomplete</span>
            <span className="font-medium">Complete</span>
          </div>

          {
            tasks.map(() => (
                <TaskCard></TaskCard>
            ))
          }
        </div>
      </div>
    </>
  );
}

export default MyTask;
