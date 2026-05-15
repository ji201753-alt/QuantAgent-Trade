import os
import shutil
import tarfile
from datetime import datetime
from typing import List

class ArchiveManager:
    """
    Manages local archiving and compression of investigations and replay data.
    Ensures long-term forensic storage is optimized and accessible.
    """
    def __init__(self, base_dir: str = "storage/archives/"):
        self.base_dir = base_dir
        os.makedirs(base_dir, exist_ok=True)

    def archive_case(self, case_id: str, case_data_path: str):
        """
        Compresses a completed investigation case and its evidence into a portable archive.
        """
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        archive_path = os.path.join(self.base_dir, f"case_{case_id}_{timestamp}.tar.gz")

        with tarfile.open(archive_path, "w:gz") as tar:
            if os.path.exists(case_data_path):
                tar.add(case_data_path, arcname=os.path.basename(case_data_path))

        return archive_path

    def list_archives(self) -> List[str]:
        return [f for f in os.listdir(self.base_dir) if f.endswith(".tar.gz")]
