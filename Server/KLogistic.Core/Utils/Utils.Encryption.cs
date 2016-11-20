using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace KLogistic
{
    public static partial class Utils
    {        
        public static string HashPassword(string password, byte[] salt = null)
        {
            byte[] text = Encoding.UTF8.GetBytes(password);
            if (salt == null)
                salt = Encoding.UTF8.GetBytes("no password!!!");

            HashAlgorithm algorithm = new SHA256Managed();

            byte[] plainTextWithSaltBytes = new byte[text.Length + salt.Length];

            for (int i = 0; i < text.Length; i++)
                plainTextWithSaltBytes[i] = text[i];

            for (int i = 0; i < salt.Length; i++)
                plainTextWithSaltBytes[text.Length + i] = salt[i];

            return Convert.ToBase64String(algorithm.ComputeHash(plainTextWithSaltBytes));
        }
    }
}
