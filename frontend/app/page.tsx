import Header from "./components/Header";
import UploadComponent from "./components/UploadComponent";

export default function Home() {
  return (
      <main>
        <Header />
        <div className="py-24">
          <UploadComponent />
        </div>
      </main>
  );
}
