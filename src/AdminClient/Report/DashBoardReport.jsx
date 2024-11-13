import {useState,useEffect} from 'react'

const DashBoardReport = () => {

    const [report, setReport] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    

    const fetchReport = async () => {
        try {
          // Fetch dữ liệu từ cả hai API
          const [response1, response2] = await Promise.all([
            fetch('https://server-voucher.vercel.app/api/getReport'),  
            fetch('https://server-voucher.vercel.app/api/getVoucherByAdmin')   
          ]);
          
  
          const data1 = await response1.json();
          const data2 = await response2.json();
  
          // Join dữ liệu từ data1 và data2 dựa trên id
          const mergedData = data1.map(item1 => {
            const item2 = data2.find(item => item.id === item1.id);
            return { ...item1, ...item2 };  // Kết hợp cả hai đối tượng
          });

          console.log("Dữ liệu sau khi join: ", mergedData);
  
          setReport(mergedData);  // Lưu dữ liệu đã join vào state
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    useEffect(() => {
        fetchReport();
    }, []);



  return (
    <div>
      <div>
        Total Report
      </div>
      <div>
       Solved
      </div>
      <div>
        Unsolved
      </div>
    <div>
        Line chart
    </div>
    </div>
  )
}

export default DashBoardReport
