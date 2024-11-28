import mysql.connector
from mysql.connector import Error

def create_database():
    connection = None  # Đảm bảo biến connection luôn tồn tại trong scope
    try:
        # Kết nối đến MySQL server (không cần chọn database)
        connection = mysql.connector.connect(
            host='localhost',  # hoặc 'db' nếu sử dụng Docker container
            user='root',
            password='123456'
        )

        if connection.is_connected():
            print("Kết nối thành công đến MySQL Server")

            cursor = connection.cursor()
            # Tạo cơ sở dữ liệu
            cursor.execute("CREATE DATABASE IF NOT EXISTS ezpdf")
            print("Cơ sở dữ liệu 'ezpdf' đã được tạo hoặc đã tồn tại.")

            # Cấp quyền cho người dùng (nếu cần)
            # cursor.execute("GRANT ALL PRIVILEGES ON ezpdf.* TO 'root'@'localhost' IDENTIFIED BY 'dinhthai2004'")
            cursor.execute("GRANT ALL PRIVILEGES ON ezpdf.* TO 'root'@'localhost'")

            cursor.execute("FLUSH PRIVILEGES")
            print("Cấp quyền cho người dùng 'root' trên cơ sở dữ liệu 'ezpdf'.")

            # Thoát cursor và kết nối
            cursor.close()

    except Error as e:
        print(f"Lỗi khi kết nối MySQL: {e}")
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("Đã đóng kết nối với MySQL.")

def main():
    create_database()

if __name__ == "__main__":
    main()

# from mysql.connector import pooling, Error

# class MysqlData:
#     def __init__(self):
#         self.host = "localhost"
#         self.user = "root"
#         self.password = "123456"
#         self.database_name = "user_data"
#         self.table_name = "users"

#         dbconfig = {
#             "user": self.user,
#             "password": self.password,
#             "host": self.host,
#             "database": self.database_name
#         }

#         try:
#             # Khởi tạo pool kết nối
#             self.cnxpool = pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **dbconfig)
#             print("Kết nối cơ sở dữ liệu thành công và pool đã được khởi tạo.")
#         except Error as e:
#             print(f"Lỗi khi khởi tạo pool kết nối: {e}")
#             self.cnxpool = None

#     def get_db_connection(self):
#         # Kiểm tra xem pool kết nối có được tạo hay không
#         if self.cnxpool:
#             try:
#                 connection = self.cnxpool.get_connection()
#                 print("Kết nối được lấy từ pool")
#                 return connection
#             except Error as e:
#                 print(f"Lỗi khi lấy kết nối: {e}")
#         else:
#             print("Pool kết nối không được khởi tạo!")
#             return None

# # Kiểm tra kết nối
# mysql_data = MysqlData()
# connection = mysql_data.get_db_connection()
# if connection:
#     connection.close()
#     print("Đã đóng kết nối")
