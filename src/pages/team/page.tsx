
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import TeamDirectory from './components/TeamDirectory';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <TeamDirectory />
      </main>
      <Footer />
    </div>
  );
}